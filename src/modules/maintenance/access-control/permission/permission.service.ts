import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from './dtos/permission.dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepository) {}

  async findAllPermissions(): Promise<PermissionResponseDto[]> {
    const data = await this.permissionRepo.findAllPermissions();
    return plainToInstance(PermissionResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async findPermissionForUser(userId: string): Promise<any[]> {
    const data = await this.permissionRepo.findPermissionForUser(userId);
    return data;
  }

  async createPermission(permission: CreatePermissionDto): Promise<PermissionResponseDto> {
    const data = await this.permissionRepo.createPermission(permission);
    return plainToInstance(PermissionResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async updatePermission(
    id: string,
    permission: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const data = await this.permissionRepo.updatePermission(id, permission);
    return plainToInstance(PermissionResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async deletePermission(id: string): Promise<void> {
    await this.permissionRepo.deletePermission(id);
  }
}
