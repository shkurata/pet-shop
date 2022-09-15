import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PetInterface, UserInterface } from '@pet-shop/data';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/models/user.model';

@Entity('pets')
@ObjectType()
export class Pet implements PetInterface {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToOne(() => User, (user) => user.pets)
  @Field(() => User)
  owner: UserInterface;
}
