import { SetMetadata } from '@nestjs/common';
import { ServiceType } from 'aws-sdk/clients/ec2';

export const Scopes = (...scopes: ServiceType[]) =>
  SetMetadata('scopes', scopes);
