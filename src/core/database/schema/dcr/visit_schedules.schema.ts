import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { users } from '../maintenance/users/users.schema';

export const visitSchedules = pgTable('visit_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),

  status: varchar('status', { length: 50 }).notNull(),

  createdBy: uuid('created_by')
    .references(() => users.id)
    .notNull(),
  approvedBy: uuid('approved_by').references(() => users.id),
});
