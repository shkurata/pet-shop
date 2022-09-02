import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Pet } from '../pets/models/pet.model';
import { PetsModule } from '../pets/pets.module';
import { User } from '../users/models/user.model';
import { UsersModule } from '../users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5435,
      username: 'petshop',
      password: 'petshop',
      database: 'pet-shop',
      entities: [User, Pet],
      synchronize: true, // shouldn't be used in production - otherwise you can lose production data
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      include: [PetsModule, UsersModule],
      autoSchemaFile: true,
      sortSchema: true,
    }),
    PetsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
