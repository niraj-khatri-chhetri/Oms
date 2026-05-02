import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

export type PermissionMode = 'all' | 'any';

export interface PermissionsMetadata {
  permissions: string[];
  mode: PermissionMode;
}

/**
 * Decorator to require specific permissions for route access.
 *
 * @param permissions - A single permission string or array of permission strings
 * @param mode - Permission matching mode:
 *   - 'all': User must have ALL specified permissions (default)
 *   - 'any': User must have ANY of the specified permissions
 *
 * @example
 * // Require a single permission
 * @RequirePermissions('read:users')
 * getUsers() { }
 *
 * @example
 * // Require multiple permissions (all required)
 * @RequirePermissions(['create:posts', 'delete:posts'])
 * deletePost() { }
 *
 * @example
 * // Require at least one permission
 * @RequirePermissions(['admin', 'moderator'], 'any')
 * manageDashboard() { }
 */
export const RequirePermissions = (permissions: string | string[], mode: PermissionMode = 'all') =>
  SetMetadata(PERMISSIONS_KEY, {
    permissions: Array.isArray(permissions) ? permissions : [permissions],
    mode,
  } satisfies PermissionsMetadata);
