import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { SpaceRoleType } from '../constant/space-role.type';

@InputType()
class SpaceRoleInput {
  @Field(() => SpaceRoleType)
  role: SpaceRoleType;
}

@InputType()
export class RegisterSpaceInput {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: true })
  logo!: string;

  @Field(() => [SpaceRoleInput], { nullable: false })
  spaceRole?: SpaceRoleInput[];
}
