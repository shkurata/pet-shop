import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, ObjectID, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pets')
@ObjectType()
export class Pet {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  ownerId: string;
}
