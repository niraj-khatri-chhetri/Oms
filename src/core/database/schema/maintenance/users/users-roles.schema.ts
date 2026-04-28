import { uuid, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { roles } from '../access-control/roles.schema';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';

export const usersRoles = pgTable('users_roles', {
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  roleId: uuid('role_id')
    .references(() => roles.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRolesRelations = relations(usersRoles, ({ one }) => ({
  user: one(users, {
    fields: [usersRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [usersRoles.roleId],
    references: [roles.id],
  }),
}));
