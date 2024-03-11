import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { RedisService } from './configurations/redis.service';
import { MysqlService } from './configurations/mysql.service';
import { Auth } from './auth/entity/auth.entity';
import { LoggerMiddleware } from './utils/logger';
import { PetsModule } from './pets/pets.module';
import { Pets } from './pets/entity/pets.entity';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [join(process.cwd(), 'dist/**/*entity.js')],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Auth, Pets]),
    AuthModule,
    PetsModule,
  ],
  providers: [RedisService, MysqlService],
  exports: [TypeOrmModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
