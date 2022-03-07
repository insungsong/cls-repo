import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteSpaceRoleInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: false })
  spaceRoleId: string;
}
