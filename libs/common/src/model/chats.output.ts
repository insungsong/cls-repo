import { Field, ObjectType } from '@nestjs/graphql';
import { Many, One } from '.';

@ObjectType()
export class Chat {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  fileId?: string;

  @Field({ nullable: true })
  content?: string;
}

@ObjectType()
export class ChatsOutput extends Many(Chat) {}
