import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { users } from "../users/users.schema";

export const designations = pgTable('designations', {
     id: uuid('id').primaryKey().defaultRandom(),

     createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
     updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdateFn(() => sql`now()`).default(sql`null`),
     deletedAt: timestamp('deleted_at', { withTimezone: true }),
     name: varchar('name', { length: 255 }).notNull().unique(),
     description: varchar('description', { length: 255 }).notNull()
})

export const designationsRelations = relations(designations, ({ many }) => ({
     users: many(users)
}))