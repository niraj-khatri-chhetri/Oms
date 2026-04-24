import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { users } from 'src/core/database/schema';
import { NewUser, UserResponse } from './types/user.types';

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAllUsers(): Promise<UserResponse[]> {
    const data = await this.db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
    return data;
  }

  async createUser(userData: NewUser): Promise<UserResponse> {
    const [data] = await this.db.insert(users).values(userData).returning();
    return data;
  }
}
