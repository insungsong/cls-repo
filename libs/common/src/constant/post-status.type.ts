import { registerEnumType } from '@nestjs/graphql';

export enum PostStatus {
  REGISTER = 'REGISTER',
  DELETED = 'DELETED',
}

registerEnumType(PostStatus, {
  name: 'PostType',
  description: 'Post 타입',
  valuesMap: {
    REGISTER: {
      description: 'REGISTER',
    },
    DELETED: {
      description: 'DELETED',
    },
  },
});
