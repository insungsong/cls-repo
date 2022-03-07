import { registerEnumType } from '@nestjs/graphql';

export enum SpaceRoleType {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  PARTICIPANT = 'PARTICIPANT',
}

registerEnumType(SpaceRoleType, {
  name: 'SpaceRoleType',
  description: 'SpaceRoleType',
  valuesMap: {
    ADMIN: { description: 'ADMIN' },
    MANAGER: { description: 'MANAGER' },
    PARTICIPANT: { description: 'PARTICIPANT' },
  },
});
