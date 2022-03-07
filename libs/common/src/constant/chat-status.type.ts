import { registerEnumType } from '@nestjs/graphql';

export enum ChatStatus {
  REGISTER = 'REGISTER',
  DELETED = 'DELETED',
}

registerEnumType(ChatStatus, {
  name: 'ChatStatusType',
  description: 'ChatStatus 타입',
  valuesMap: {
    REGISTER: {
      description: 'REGISTER',
    },
    DELETED: {
      description: 'DELETED',
    },
  },
});
