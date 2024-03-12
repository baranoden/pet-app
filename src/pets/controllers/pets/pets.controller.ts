import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { adoptDto, getUserPetDto, petPetDto } from 'src/pets/dto/pets.dto';
import { PetsService } from 'src/pets/pets.service';

@Controller('pets')
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Post('adopt')
  async handleLogin(@Body() adoptPayload: adoptDto) {
    return this.petsService.adoptPet(adoptPayload);
  }

  @Get('checkPet')
  async checkPet(@Body() getUserPetDto: getUserPetDto) {
    return this.petsService.getUserPet(getUserPetDto);
  }

  @Post('petPet')
  async petPet(@Body() petPetPayload: petPetDto) {
    return this.petsService.petPet(petPetPayload);
  }
}
