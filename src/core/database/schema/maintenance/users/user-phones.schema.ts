import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { relations, sql } from 'drizzle-orm';

export const phoneTypeEnum = pgEnum('phone_type', ['personal', 'work', 'other']);

export const userPhones = pgTable('user_phones', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),

  phone: text('phone').notNull(),
  type: phoneTypeEnum('type').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const userPhonesRelations = relations(userPhones, ({ one }) => ({
  user: one(users, {
    fields: [userPhones.userId],
    references: [users.id],
  }),
}));
