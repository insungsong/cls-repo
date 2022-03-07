import { Field, InputType } from '@nestjs/graphql';
import { PostType } from '../constant/post.type';

@InputType()
export class RegisterPostInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: false })
  spaceId: string;

  @Field(() => PostType, { nullable: false })
  type!: PostType;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  anonymous?: boolean;

  @Field(() => String, { nullable: true })
  file?: string;
}
