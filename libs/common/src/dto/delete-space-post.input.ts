import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteSpacePostInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: false })
  postId: string;
}
