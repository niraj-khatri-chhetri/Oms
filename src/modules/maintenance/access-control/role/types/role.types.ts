import { roles } from 'src/core/database/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Basic type definitions for Role entity
export type Role = InferSelectModel<typeof roles>;
export type NewRole = InferInsertModel<typeof roles>;
export type UpdateRole = Partial<NewRole>;

// Role with permissions type definitions (These will be used more than the basic ones)
export type RoleWithPermissions = Role & {
  rolesPermissions: {
    permissionId: string;
  }[];
};

export type NewRoleWithPermissions = NewRole & {
  permissions: string[];
};

export type UpdateRoleWithPermissions = Partial<NewRoleWithPermissions>;
