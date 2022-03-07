import { registerEnumType } from '@nestjs/graphql';

export enum SpaceRoleStatus {
  REGISTER = 'REGISTER',
  DELETED = 'DELETED',
}

registerEnumType(SpaceRoleStatus, {
  name: 'SpaceRoleStatus',
  description: 'SpaceRoleStatus',
  valuesMap: {
    REGISTER: { description: 'REGISTER' },
    DELETED: { description: 'DELETED' },
  },
});
