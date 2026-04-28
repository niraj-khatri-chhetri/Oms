import { relations, sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

import { rolesPermissions } from './roles-permissions.schema';
import { usersRoles } from '../users/users-roles.schema';
import { users } from '../users/users.schema';

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),

  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  rolesPermissions: many(rolesPermissions),
  usersRoles: many(usersRoles),
}));
