import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { users } from 'src/core/database/schema';

@Injectable()
export class UserRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAllUsers(): Promise<any[]> {
    const data = await this.db.select().from(users);
    return data;
  }

  async createUser(userData: any): Promise<any> {
    const [data] = await this.db.insert(users).values(userData).returning();
    return data;
  }
}
