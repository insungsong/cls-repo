import { Field, ObjectType } from '@nestjs/graphql';
import { Many, One } from '.';

@ObjectType()
export class Post {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  fileId?: string;

  @Field({ nullable: true })
  postId?: string;

  @Field({ nullable: true })
  spaceId?: string;

  @Field({ nullable: true })
  content?: string;
}

@ObjectType()
export class PostsOutput extends Many(Post) {}
