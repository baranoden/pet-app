import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis();
  }

  async onModuleInit() {
    console.log('Redis Connection Succeded');
  }
}
