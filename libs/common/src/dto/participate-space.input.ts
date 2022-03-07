import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { SpaceRoleType } from '../constant/space-role.type';

@InputType()
export class ParticipateSpaceInput {
  @Field({ nullable: true })
  email?: string;

  @IsUUID()
  @Field({ nullable: false })
  spaceId: string;

  @Field({ nullable: true })
  managerCode?: string;

  @Field({ nullable: true })
  participantCode?: string;
}
