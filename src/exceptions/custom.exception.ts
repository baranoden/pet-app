import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('User not found', HttpStatus.NOT_FOUND);
  }
}

export class IncorrectPasswordException extends HttpException {
  constructor() {
    super('Password is not correct', HttpStatus.UNAUTHORIZED);
  }
}

export class UnauthorizedTransaction extends HttpException {
  constructor() {
    super('Unauthorized Transaction', HttpStatus.UNAUTHORIZED);
  }
}

export class ThisUsernameIsTaken extends HttpException {
  constructor() {
    super('This username is taken... :( ', HttpStatus.BAD_REQUEST);
  }
}

export class PetNotFound extends HttpException {
  constructor() {
    super('Pet not found', HttpStatus.NOT_FOUND);
  }
}
