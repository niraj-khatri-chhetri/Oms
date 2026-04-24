import { uuid, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import { users } from '../users/users.schema';

import { resources } from './resources.schema';
import { rolesPermissions } from './roles-permissions.schema';

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  description: varchar('description', { length: 255 }).notNull(),

  resourceId: uuid('resource_id')
    .notNull()
    .references(() => resources.id, { onDelete: 'cascade' }),

  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const permissionsRelations = relations(permissions, ({ one, many }) => ({
  resource: one(resources, {
    relationName: 'permission_resource',
    fields: [permissions.resourceId],
    references: [resources.id],
  }),

  roles: many(rolesPermissions),
}));
