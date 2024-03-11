import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Redis, RedisKey } from 'ioredis';
import { UnauthorizedTransaction } from 'src/exceptions/custom.exception';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['authentication'] as RedisKey;

    const sessionExists = await this.redisClient.exists(userId);

    if (!sessionExists) {
      throw new UnauthorizedTransaction();
    }
    if (sessionExists) {
      await this.redisClient.expire(userId, process.env.TOKEN_EXPIRE_TIME);
      next();
    }
  }
}
