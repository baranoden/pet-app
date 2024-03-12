import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { Pets } from './entity/pets.entity';
import { adoptDto, getUserPetDto, petPetDto } from './dto/pets.dto';
import {
  PetNotFound,
  UserAlreadyHasPet,
  UserHasAlreadyPetted,
  UserHaveNotPet,
} from 'src/exceptions/custom.exception';
import { Auth } from 'src/auth/entity/auth.entity';
import { UserType } from 'src/utils/types';

@Injectable()
export class PetsService {
  private readonly redisService: Redis;

  constructor(
    @InjectRepository(Pets)
    private petsRepository: Repository<Pets>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {
    this.redisService = new Redis();
  }

  async getUserPet(getUserPetPayload: getUserPetDto): Promise<Pets> {
    const pet = await this.redisService.get(`${getUserPetPayload.userId}_pet`);

    if (!pet) {
      throw new UserHaveNotPet();
    }
    const doesPetExistInDB = await this.petsRepository.findOne({
      where: { id: pet.replace(/_pet$/, '') },
    });
    if (!doesPetExistInDB) {
      throw new PetNotFound();
    }
    return doesPetExistInDB;
  }

  async adoptPet(adoptPayload: adoptDto): Promise<void> {
    const pet = await this.petsRepository.findOne({
      where: { id: adoptPayload.petId },
    });

    if (!pet) {
      throw new PetNotFound();
    }

    const adoptedPet = await this.redisService.get(
      `${adoptPayload.userId}_pet`,
    );

    if (adoptedPet) {
      throw new UserAlreadyHasPet();
    }
    await this.redisService.set(
      `${adoptPayload.userId}_pet`,
      adoptPayload.petId,
      'EX',
      24 * 60 * 60,
    );
  }

  // const user = await this.authRepository.findOne(userId);
  // user.points += 1;
  // await this.authRepository.save(user);

  async petPet(petPetPayload: petPetDto): Promise<{
    petAgain: number;
    petLife: number;
    userPoints: UserType['points'];
    message: string;
  }> {
    const pet = await this.redisService.get(`${petPetPayload.userId}_pet`);
    const user = await this.authRepository.findOne({
      where: { id: petPetPayload.userId },
    });
    if (!pet) {
      throw new UserHaveNotPet();
    }

    const hasPetted = await this.redisService.get(
      `${petPetPayload.userId}_hasPetted`,
    );
    const petLife = await this.redisService.ttl(`${petPetPayload.userId}_pet`);
    const petAgain = await this.redisService.ttl(
      `${petPetPayload.userId}_hasPetted`,
    );
    if (hasPetted) {
      return {
        petAgain: petAgain,
        petLife: petLife,
        userPoints: user.points,
        message: 'Already petted before',
      };
    }

    await this.redisService.set(
      `${petPetPayload.userId}_pet`,
      pet,
      'EX',
      24 * 60 * 60,
    );

    await this.redisService.set(
      `${petPetPayload.userId}_hasPetted`,
      'true',
      'EX',
      60 * 60,
    );
    const transformToNumber = +user.points + 1;
    user.points = transformToNumber;
    await this.authRepository.save(user);

    return {
      petAgain: 60 * 60,
      petLife: petLife,
      userPoints: user.points,
      message: 'You can pet 1 hour later',
    };
  }
}
