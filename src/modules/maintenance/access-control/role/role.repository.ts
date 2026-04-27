import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { CreateRoleDto } from './dtos/role.dtos';
import { roles, rolesPermissions } from 'src/core/database/schema';
import { and, eq, isNull } from 'drizzle-orm';
import {
  NewRoleWithPermissions,
  Role,
  RoleWithPermissions,
  UpdateRoleWithPermissions,
} from './types/role.types';

@Injectable()
export class RoleRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAllRoles(): Promise<any[]> {
    return await this.db.query.roles.findMany({
      columns: {
        deletedAt: false,
      },
    });
  }

  async findRoleByIdWithPermissions(id: string): Promise<RoleWithPermissions | null> {
    const data = await this.db.query.roles.findFirst({
      where: and(eq(roles.id, id), isNull(roles.deletedAt)),
      with: {
        rolesPermissions: {
          columns: {
            permissionId: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    return data;
  }

  async createRoleWithPermissions(newRole: NewRoleWithPermissions): Promise<Role> {
    const data = await this.db.transaction(async (tx) => {
      const [role] = await tx
        .insert(roles)
        .values({
          name: newRole.name,
          description: newRole.description,
        })
        .returning();

      const rolePermissionsData = newRole.permissions.map((permissionId) => ({
        roleId: role.id,
        permissionId,
      }));

      await tx.insert(rolesPermissions).values(rolePermissionsData);

      return role;
    });

    return data;
  }

  async updateRoleWithPermissions(
    id: string,
    updatedRole: UpdateRoleWithPermissions,
  ): Promise<Role | null> {
    const data = await this.db.transaction(async (tx) => {
      const existingRole = await tx.query.roles.findFirst({
        where: and(eq(roles.id, id), isNull(roles.deletedAt)),
        columns: {
          id: true,
        },
      });

      if (!existingRole) {
        return null;
      }

      const [role] = await tx
        .update(roles)
        .set({
          name: updatedRole.name,
          description: updatedRole.description,
        })
        .where(and(eq(roles.id, id), isNull(roles.deletedAt)))
        .returning();

      await tx.delete(rolesPermissions).where(eq(rolesPermissions.roleId, id));

      const uniquePermissionIds = [...new Set(updatedRole.permissions)];
      if (uniquePermissionIds.length > 0) {
        const rolePermissionsData = uniquePermissionIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        }));

        await tx.insert(rolesPermissions).values(rolePermissionsData);
      }

      return role;
    });

    return data;
  }
}
