import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users } from 'src/core/database/schema';

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type UserResponse = Omit<User, 'password' | 'refreshToken' | 'deletedAt'>;

export type JwtPayload = {
  userId: string;
  email: string;
  permissions: string[];
};
