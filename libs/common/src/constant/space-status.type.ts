import { registerEnumType } from '@nestjs/graphql';

export enum SpaceStatusType {
  SPACE = 'SPACE',
  PARTICIPANT = 'PARTICIPANT',
}

registerEnumType(SpaceStatusType, {
  name: 'SpaceStatusType',
  description: 'SpaceStatusType',
  valuesMap: {
    SPACE: { description: 'SPACE' },
    PARTICIPANT: { description: 'PARTICIPANT' },
  },
});
