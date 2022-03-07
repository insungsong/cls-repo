import { ServiceType } from '@libs/common/constant';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { ScopeAuthGuard } from '../guard/scope-auth.guard';
import { UserAuthGuard } from '../guard/user-auth.guard';
import { Scopes } from './scopes.decorator';

export function ScopedAuth(scopes: ServiceType[]) {
  return applyDecorators(
    Scopes(...scopes),
    UseGuards(UserAuthGuard, ScopeAuthGuard),
  );
}
