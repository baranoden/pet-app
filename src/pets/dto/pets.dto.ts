import { IsNotEmpty, IsString } from 'class-validator';

export class adoptDto {
  @IsString({ message: 'PetID must be string' })
  @IsNotEmpty({ message: 'PetID cannot be empty' })
  petId: string;

  @IsString({ message: 'UserID must be string' })
  @IsNotEmpty({ message: 'UserID cannot be empty' })
  userId: string;
}

export class getUserPetDto {
  @IsString({ message: 'UserID must be string' })
  @IsNotEmpty({ message: 'UserID cannot be empty' })
  userId: string;
}

export class petPetDto {
  @IsString({ message: 'UserID must be string' })
  @IsNotEmpty({ message: 'UserID cannot be empty' })
  userId: string;
}
