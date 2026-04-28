import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations, sql } from 'drizzle-orm';

export const emailTypeEnum = pgEnum('email_type', ['personal', 'work', 'other']);

export const userEmails = pgTable('user_emails', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  email: text('email').notNull(),
  type: emailTypeEnum('type').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const userEmailsRelations = relations(userEmails, ({ one }) => ({
  user: one(users, {
    fields: [userEmails.userId],
    references: [users.id],
  }),
}));
