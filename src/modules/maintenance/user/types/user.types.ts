import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from 'src/core/database/schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
