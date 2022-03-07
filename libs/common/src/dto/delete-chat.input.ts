import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class DeleteChatInput {
  email?: string;

  @Field()
  @IsString()
  chatId: string;
}
