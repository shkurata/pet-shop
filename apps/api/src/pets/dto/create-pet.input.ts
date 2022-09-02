import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePetInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  ownerId: string;
}
