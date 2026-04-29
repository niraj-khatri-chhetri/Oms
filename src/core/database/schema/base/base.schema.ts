import { uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from '../maintenance/users/users.schema';

export const baseColumns = {
     id: uuid('id').primaryKey().defaultRandom(),
     createdBy: uuid('created_by').references(() => users.id),
     createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
     updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
     deletedAt: timestamp('deleted_at', { withTimezone: true }),
};