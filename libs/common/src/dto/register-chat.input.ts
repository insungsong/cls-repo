import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

@InputType()
export class RegisterChatInput {
  email?: string;

  @Field()
  @IsUUID()
  spaceId: string;

  @Field()
  @IsString()
  @IsUUID()
  postId: string;

  @Field({ nullable: true })
  @IsBoolean()
  anonymous?: boolean;

  @Field()
  @IsString()
  content: string;

  @Field({ nullable: true })
  @IsString()
  parentsChatId?: string;
}
