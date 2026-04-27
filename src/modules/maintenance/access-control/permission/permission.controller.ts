import { Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, PermissionResponseDto } from './dtos/permission.dtos';
import {
  ApiCreateEndpoint,
  ApiDeleteEndpoint,
  ApiGetEndpoint,
  ApiUpdateEndpoint,
} from 'src/common/decorators/api-endpoint.decorator';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiGetEndpoint({
    summary: 'Get all permissions',
    responseType: PermissionResponseDto,
    isArray: true,
  })
  @Get()
  async findAllPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionService.findAllPermissions();
  }

  @ApiCreateEndpoint({
    summary: 'Create a new permission',
    responseType: PermissionResponseDto,
  })
  @Post()
  async createPermission(@Body() permission: CreatePermissionDto) {
    const data = await this.permissionService.createPermission(permission);
    return {
      data,
      message: 'Permission created successfully',
    };
  }

  @ApiUpdateEndpoint({
    summary: 'Update an existing permission',
    responseType: PermissionResponseDto,
  })
  @Patch(':id')
  async updatePermission(@Param('id') id: string, @Body() permission: CreatePermissionDto) {
    const data = await this.permissionService.updatePermission(id, permission);
    return {
      data,
      message: 'Permission updated successfully',
    };
  }

  @ApiDeleteEndpoint({
    summary: 'Delete a permission',
  })
  @Delete(':id')
  async deletePermission(@Param('id') id: string) {
    const data = await this.permissionService.deletePermission(id);
    return {
      data,
      message: 'Permission deleted successfully',
    };
  }
}
