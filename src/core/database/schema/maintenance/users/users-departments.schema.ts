import { timestamp, uuid, pgTable } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { users } from './users.schema';
import { departments } from '../departments/departments.schema';
import { primaryKey } from 'drizzle-orm/pg-core';

export const usersDepartments = pgTable(
  'users_departments',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    departmentId: uuid('department_id')
      .notNull()
      .references(() => departments.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.departmentId] })],
);

export const usersDepartmentsRelations = relations(usersDepartments, ({ one }) => ({
  user: one(users, {
    fields: [usersDepartments.userId],
    references: [users.id],
  }),

  department: one(departments, {
    fields: [usersDepartments.departmentId],
    references: [departments.id],
  }),
}));
