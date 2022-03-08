import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class FetchChatsInput {
  email?: string;

  @Field()
  @IsString()
  postId: string;
}
