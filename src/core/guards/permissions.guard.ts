import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PermissionsMetadata } from 'src/common/decorators/permissions.decorator';
import { PermissionService } from 'src/modules/maintenance/access-control/permission/permission.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadata = this.reflector.getAllAndOverride<PermissionsMetadata>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!metadata?.permissions?.length) return true;

    const { user } = context.switchToHttp().getRequest();
    const userPerms = await this.permissionService.findPermissionForUser(user.userId);

    const { permissions, mode } = metadata;

    const hasPermission =
      mode === 'any'
        ? permissions.some((p) => userPerms.includes(p))
        : permissions.every((p) => userPerms.includes(p));

    if (!hasPermission) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
