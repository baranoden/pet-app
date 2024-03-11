import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { loginDto, registerDto } from 'src/auth/dto/auth.dto';
import { LocalGuard } from 'src/auth/guards/local.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async handleLogin(@Body() authPayload: loginDto) {
    return this.authService.checkUser(authPayload);
  }

  @Post('register')
  async handleRegister(@Body(new ValidationPipe()) authPayload: registerDto) {
    return this.authService.createUser(authPayload);
  }
}
