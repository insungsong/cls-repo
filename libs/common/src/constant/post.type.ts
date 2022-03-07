import { registerEnumType } from '@nestjs/graphql';

export enum PostType {
  NOTIFICATION = 'NOTIFICATION',
  QUESTION = 'QUESTION',
}

registerEnumType(PostType, {
  name: 'PostType',
  description: '서비스 타입',
  valuesMap: {
    NOTIFICATION: {
      description: '공지',
    },
    QUESTION: {
      description: '공지',
    },
  },
});
