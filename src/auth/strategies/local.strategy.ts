import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';
import { UnauthorizedTransaction } from 'src/exceptions/custom.exception';

@Injectable()
export class localStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string) {
    const user = this.authService.checkUser({ username, password });
    if (!user) throw new UnauthorizedTransaction();
    return user;
  }
}
