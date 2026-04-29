export const PERMISSIONS = {
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    DELETE: 'user:delete',
    UPDATE: 'user:update',
  },
  DEPARTMENT: {
    VIEW: 'department:view',
    CREATE: 'department:create',
    UPDATE: 'department:update',
    DELETE: 'department:delete',
  },
} as const;

export type PermissionKeyType = {
  [Group in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[Group][keyof (typeof PERMISSIONS)[Group]];
}[keyof typeof PERMISSIONS];
