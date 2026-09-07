import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, IS_PUBLIC_KEY } from '../decorators';
import { ICurrentUser } from '../../../shared/interfaces';
import { RbacDomainService } from '../../../domain/rbac/services';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: ICurrentUser = request.user;
    if (!user) throw new ForbiddenException('Access denied');

    if (
      !RbacDomainService.hasPermission(
        user.roles,
        user.permissions,
        requiredPermissions,
      )
    ) {
      throw new ForbiddenException(
        'You do not have the required permission to access this resource',
      );
    }

    return true;
  }
}
