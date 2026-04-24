import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm/sql/sql';
import { userRoles } from './users-roles.schema';
import { relations } from 'drizzle-orm';

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
  roles: many(userRoles),
}));
