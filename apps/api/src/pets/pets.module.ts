import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsResolver } from './pets.resolver';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './models/pet.model';
import { User } from '../users/models/user.model';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, User]), CaslModule],
  providers: [PetsResolver, PetsService, UsersService],
})
export class PetsModule {}
