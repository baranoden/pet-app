import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './controllers/pets/pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pets } from './entity/pets.entity';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenMiddleware } from 'src/auth/middleware/RefreshToken.middleware';
import { Auth } from 'src/auth/entity/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pets, Auth])],
  controllers: [PetsController],
  providers: [PetsService, ConfigModule],
})
export class PetsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes(PetsController);
  }
}
