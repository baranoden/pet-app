import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entity/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { localStrategy } from './strategies/local.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService, localStrategy, ConfigModule],
})
export class AuthModule {}
