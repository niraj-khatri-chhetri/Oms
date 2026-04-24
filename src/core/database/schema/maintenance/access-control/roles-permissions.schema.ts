import { pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';

import { permissions } from './permissions.schema';
import { roles } from './roles.schema';
import { relations } from 'drizzle-orm';

export const rolesPermissions = pgTable(
  'roles_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),

    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })],
);

export const rolesPermissionsRelations = relations(rolesPermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolesPermissions.roleId],
    references: [roles.id],
  }),

  permission: one(permissions, {
    fields: [rolesPermissions.permissionId],
    references: [permissions.id],
  }),
}));
