import { uuid, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { roles } from '../access-control/roles.schema';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const userRoles = pgTable('users_roles', {
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  roleId: uuid('role_id')
    .references(() => roles.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userRoleRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));
