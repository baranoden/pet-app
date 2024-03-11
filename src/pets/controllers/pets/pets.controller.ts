import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { adoptDto } from 'src/pets/dto/pets.dto';
import { PetsService } from 'src/pets/pets.service';

@Controller('pets')
export class PetsController {
  constructor(private petsService: PetsService) {}

  @Post('adopt')
  async handleLogin(@Body() adoptPayload: adoptDto) {
    return this.petsService.adoptPet(adoptPayload);
  }
}
