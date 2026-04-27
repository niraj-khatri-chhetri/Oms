import { Inject, Injectable } from '@nestjs/common';
import { eq, isNull } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { resources } from 'src/core/database/schema';
import { NewResource, Resource, UpdateResource } from './types/resource.types';

@Injectable()
export class ResourceRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAllResources() {
    const data = await this.db.select().from(resources).where(isNull(resources.deletedAt));
    return data;
  }

  async findAllReourcesWithPermissions() {
    const data = await this.db.query.resources.findMany({
      with: {
        permissions: {
          columns: {
            id: true,
            name: true,
            key: true,
            description: true,
          },
        },
      },
    });
    return data;
  }

  async createResource(resource: NewResource): Promise<Resource> {
    const [data] = await this.db.insert(resources).values(resource).returning();
    return data;
  }

  async updateResource(resource: UpdateResource, id: string): Promise<Resource> {
    const [data] = await this.db
      .update(resources)
      .set(resource)
      .where(eq(resources.id, id))
      .returning();
    return data;
  }

  async deleteResource(id: string) {
    return await this.db.delete(resources).where(eq(resources.id, id)).returning();
  }
}
