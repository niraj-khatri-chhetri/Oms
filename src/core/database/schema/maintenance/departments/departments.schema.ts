import { relations, sql } from 'drizzle-orm';
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { usersDepartments } from '../users/users-departments.schema';
import { users } from '../users/users.schema';
import { varchar } from 'drizzle-orm/pg-core';

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),

  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .$onUpdateFn(() => sql`now()`)
    .default(sql`null`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const departmentRelations = relations(departments, ({ many }) => ({
  usersDepartments: many(usersDepartments),
}));
