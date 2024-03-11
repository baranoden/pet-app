import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class loginDto {
  @IsString({ message: 'Username must be string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}

export class registerDto {
  @IsString({ message: 'Username must be string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
