import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleResponseDto, RoleWithPermissionResponseDto, UpdateRoleDto } from './dtos/role.dtos';
import { plainToInstance } from 'class-transformer';
import { NewRoleWithPermissions, Role, UpdateRoleWithPermissions } from './types/role.types';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  async findAllRoles() {
    return await this.roleRepo.findAllRoles();
  }

  async findRoleByIdWithPermissions(id: string): Promise<RoleWithPermissionResponseDto> {
    const data = await this.roleRepo.findRoleByIdWithPermissions(id);

    if (!data) {
      throw new NotFoundException(`Role not found`);
    }

    return plainToInstance(RoleWithPermissionResponseDto, data, { excludeExtraneousValues: true });
  }

  async createRoleWithPermissions(newRole: NewRoleWithPermissions): Promise<RoleResponseDto> {
    const data = await this.roleRepo.createRoleWithPermissions(newRole);
    return data;
  }

  async updateRoleWithPermissions(
    id: string,
    updatedRole: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    const data = await this.roleRepo.updateRoleWithPermissions(id, updatedRole);

    if (!data) {
      throw new NotFoundException(`Role not found`);
    }

    return data;
  }
}
