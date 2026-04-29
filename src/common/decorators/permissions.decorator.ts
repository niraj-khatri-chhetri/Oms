import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export type PermissionMode = 'all' | 'any';

export interface PermissionsMetadata {
  permissions: string[];
  mode: PermissionMode;
}

export const RequirePermissions = (permissions: string | string[], mode: PermissionMode = 'all') =>
  SetMetadata(PERMISSIONS_KEY, {
    permissions: Array.isArray(permissions) ? permissions : [permissions],
    mode,
  } satisfies PermissionsMetadata);
