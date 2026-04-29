import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import type { Permission, NewPermission, UpdatePermission } from './types/permission.types';
import { permissions, rolesPermissions, usersRoles } from 'src/core/database/schema';
import { eq, isNull } from 'drizzle-orm';

@Injectable()
export class PermissionRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAllPermissions(): Promise<Permission[]> {
    const data = await this.db.select().from(permissions).where(isNull(permissions.deletedAt));
    return data;
  }

  async findPermissionForUser(userId: string): Promise<string[]> {
    const data = await this.db
      .selectDistinct({ permissionKey: permissions.key })
      .from(usersRoles)
      .innerJoin(rolesPermissions, eq(usersRoles.roleId, rolesPermissions.roleId))
      .innerJoin(permissions, eq(rolesPermissions.permissionId, permissions.id))
      .where(eq(usersRoles.userId, userId));

    return data.map((row) => row.permissionKey);
  }

  async createPermission(permission: NewPermission): Promise<Permission> {
    const [data] = await this.db.insert(permissions).values(permission).returning();
    return data;
  }

  async updatePermission(id: string, permission: UpdatePermission): Promise<Permission> {
    const [data] = await this.db
      .update(permissions)
      .set(permission)
      .where(eq(permissions.id, id))
      .returning();
    return data;
  }

  async deletePermission(id: string): Promise<void> {
    await this.db.delete(permissions).where(eq(permissions.id, id)).returning();
  }
}
