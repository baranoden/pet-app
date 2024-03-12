import { Injectable } from '@nestjs/common';
import { loginDto, registerDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entity/auth.entity';
import { checkPassword, hashPassword } from 'src/utils/passwordOperations';
import { Redis } from 'ioredis';
import {
  IncorrectPasswordException,
  ThisUsernameIsTaken,
  UserNotFoundException,
} from 'src/exceptions/custom.exception';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private redisClient: Redis;

  constructor(
    @InjectRepository(Auth)
    private usersRepository: Repository<Auth>,
  ) {
    this.redisClient = new Redis();
  }

  async checkUser(authPayload: loginDto) {
    const user = await this.usersRepository.findOne({
      where: { username: authPayload.username },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const passwordControl = await checkPassword(
      authPayload.password,
      user.password,
    );

    if (!passwordControl) {
      throw new IncorrectPasswordException();
    }

    const { id, username } = user;
    await this.redisClient.set(
      id,
      'login',
      'EX',
      process.env.TOKEN_EXPIRE_TIME,
    );
    return {
      id: id,
      username: username,
    };
  }

  async createUser(authPayload: registerDto) {
    const user = await this.usersRepository.findOne({
      where: { username: authPayload.username },
    });

    if (user) {
      throw new ThisUsernameIsTaken();
    }

    const hashedPassword = await hashPassword(authPayload.password);

    const createUserIfNotExist = this.usersRepository.create({
      id: uuidv4(),
      username: authPayload.username,
      password: hashedPassword,
      isActive: true,
      isAdmin: false,
    });

    const saveUser = await this.usersRepository.save(createUserIfNotExist);

    const { username, id } = saveUser;
    await this.redisClient.set(
      id,
      'login',
      'EX',
      process.env.TOKEN_EXPIRE_TIME,
    );
    return {
      id: id,
      username: username,
      password: authPayload.password,
    };
  }
}
