import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../auth/entity/auth.entity';
import { v4 as uuidv4 } from 'uuid';
import { Pets } from 'src/pets/entity/pets.entity';

@Injectable()
export class MysqlService implements OnModuleInit {
  constructor(
    @InjectRepository(Auth)
    private usersRepository: Repository<Auth>,
    @InjectRepository(Pets)
    private petsRepository: Repository<Pets>,
  ) {}

  private pets = [
    { id: uuidv4(), name: 'Fluffy', type: 'Unicorn' },
    { id: uuidv4(), name: 'Sparkle', type: 'Dragon' },
  ];

  async onModuleInit() {
    const petsCount = await this.petsRepository.count();
    if (petsCount === 0) {
      for (let i = 0; i < this.pets.length; i++) {
        const petCreation = this.petsRepository.create({
          id: uuidv4(),
          name: this.pets[i].name,
          type: this.pets[i].type,
        });
        await this.petsRepository.save(petCreation);
      }
    }
    const userCount = await this.usersRepository.count();
    if (userCount === 0) {
      const user = this.usersRepository.create({
        id: uuidv4(),
        username: 'admin',
        password:
          '$2b$10$QqXo0ZGnAy6SzohPyDpPO.bXPMQHcOJtC2EgYxFMQV/URtkdH6KzW',
        isActive: true,
      });
      await this.usersRepository.save(user);
    }
  }
}
