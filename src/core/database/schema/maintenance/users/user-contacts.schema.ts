import { boolean, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

import { users } from './users.schema';

export const relationTypeEnum = pgEnum('relation_type', ['family', 'friend', 'sibling', 'other']);

export const userContacts = pgTable('user_relatives', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  relationType: relationTypeEnum('relation_type').notNull(),
  phone: text('phone'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const userContactsRelations = relations(userContacts, ({ one }) => ({
  user: one(users, {
    fields: [userContacts.userId],
    references: [users.id],
  }),
}));
