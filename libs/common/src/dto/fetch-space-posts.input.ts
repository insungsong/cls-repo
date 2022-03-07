import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FetchSpacePostsInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: false })
  spaceId: string;
}
