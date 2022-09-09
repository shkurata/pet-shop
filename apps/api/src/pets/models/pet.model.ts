import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/models/user.model';

@Entity('pets')
@ObjectType()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToOne(() => User, (user) => user.pets)
  @Field(() => User)
  owner: User;
}
