import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { Pets } from './entity/pets.entity';
import { adoptDto } from './dto/pets.dto';
import { PetNotFound } from 'src/exceptions/custom.exception';
import { Auth } from 'src/auth/entity/auth.entity';

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

  async adoptPet(adoptPayload: adoptDto): Promise<void> {
    const pet = await this.petsRepository.findOne({
      where: { id: adoptPayload.petId },
    });
    if (!pet) {
      throw new PetNotFound();
    }
    await this.redisService.hset(
      adoptPayload.userId,
      adoptPayload.petId,
      JSON.stringify(pet),
    );
    await this.redisService.expire(adoptPayload.userId, 24 * 60 * 60);
  }

  //   async petPet(userId: string): Promise<void> {
  //     const pet = await this.redisService.get(userId);
  //     if (!pet) {
  //       throw new Error('No pet to pet');
  //     }
  //     const user = await this.authRepository.findOne(userId);
  //     user.points += 1;
  //     await this.authRepository.save(user);
  //     await this.redisService.expire(userId, 24 * 60 * 60);
  //   }

  //   async isPetAlive(userId: string): Promise<boolean> {
  //     const pet = await this.redisService.get(userId);
  //     return !!pet;
  //   }
}
