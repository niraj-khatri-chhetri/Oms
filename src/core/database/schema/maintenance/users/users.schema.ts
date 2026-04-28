import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';
import { relations } from 'drizzle-orm';

import { userContacts } from './user-contacts.schema';
import { userPhones } from './user-phones.schema';
import { userEmails } from './user-emails.schema';

import { usersRoles } from './users-roles.schema';
import { usersDepartments } from './users-departments.schema';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),

  // This is temporary. Make another table for refresh tokens later.
  refreshToken: varchar('refresh_token', { length: 255 }),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const usersRelations = relations(users, ({ many }) => ({
  phones: many(userPhones),
  emails: many(userEmails),
  usersDepartments: many(usersDepartments),
  usersRoles: many(usersRoles),
  contacts: many(userContacts),
}));
