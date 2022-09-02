import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsResolver } from './pets.resolver';
import { UsersService } from '../users/users.service';

@Module({
  providers: [PetsResolver, PetsService, UsersService],
})
export class PetsModule {}
