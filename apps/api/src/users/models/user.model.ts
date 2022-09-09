import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Pet } from '../../pets/models/pet.model';

@Entity()
@Unique(['username'])
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name?: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  username: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  @Field(() => [Pet], { nullable: true })
  pets?: Pet[];
}
