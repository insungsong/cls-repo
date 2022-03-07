import { ErrorCode } from '@libs/common/constant';
import { NestException } from '@libs/common/model';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ServiceType } from 'aws-sdk/clients/ec2';

@Injectable()
export class ScopeAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  getRequest(context: ExecutionContext) {
    switch (context.getType().toString()) {
      case 'http':
        return context.switchToHttp().getRequest();
      case 'graphql':
        return GqlExecutionContext.create(context).getContext().req;
      default:
        throw new NestException(ErrorCode.ERROR, 7829);
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const scopes = this.reflector.get<ServiceType[]>(
      'scopes',
      context.getHandler(),
    );
    if (!scopes || scopes.length == 0) {
      return true;
    }

    if (!this.matchScopes(scopes, this.getRequest(context).user.scopes)) {
      if (context.getType().toString() === 'http') {
        throw new UnauthorizedException(ErrorCode.NOT_ALLOWED_USER);
      } else {
        throw new NestException(ErrorCode.NOT_ALLOWED_USER, 7829);
      }
    }
    return true;
  }

  matchScopes(scopes: ServiceType[], userScopes: ServiceType[]): boolean {
    if (userScopes == null) return false;
    return userScopes.some(
      (userScope) => scopes.find((scope) => scope === userScope) != undefined,
    );
  }
}
