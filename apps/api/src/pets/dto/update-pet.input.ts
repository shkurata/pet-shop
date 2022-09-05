import { CreatePetInput } from './create-pet.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePetInput extends PartialType(CreatePetInput) {
  @Field()
  id: string;

  @Field({ nullable: true })
  ownerId?: string;

  @Field({ nullable: true })
  name?: string;
}
