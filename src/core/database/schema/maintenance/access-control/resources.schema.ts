import { relations, sql } from 'drizzle-orm';
import { timestamp, varchar, uuid, pgTable } from 'drizzle-orm/pg-core';
import { permissions } from './permissions.schema';
import { users } from '../users/users.schema';

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: varchar('description', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }),

  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const resourcesRelations = relations(resources, ({ many }) => ({
  permissions: many(permissions),
}));
