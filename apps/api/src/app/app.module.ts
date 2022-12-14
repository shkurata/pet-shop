import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { AuthModule } from '../auth/auth.module';
import { CaslModule } from '../casl/casl.module';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: parseInt(<string>process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true, // shouldn't be used in production - otherwise you can lose production data
      autoLoadEntities: true,
      // logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      include: [PetsModule, UsersModule, AuthModule],
      autoSchemaFile: './apps/api/src/schema.gql',
      sortSchema: true,
      debug: true,
    }),
    PetsModule,
    UsersModule,
    AuthModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
