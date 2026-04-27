import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import {
  CreateRoleDto,
  RoleResponseDto,
  RoleWithPermissionResponseDto,
  UpdateRoleDto,
} from './dtos/role.dtos';
import {
  ApiCreateEndpoint,
  ApiGetEndpoint,
  ApiUpdateEndpoint,
} from 'src/common/decorators/api-endpoint.decorator';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiGetEndpoint({
    summary: 'Get all roles',
    responseType: RoleResponseDto,
    isArray: true,
  })
  @Get()
  async findAllRoles() {
    return await this.roleService.findAllRoles();
  }

  @ApiGetEndpoint({
    summary: 'Get role by ID with associated permissions',
    responseType: RoleWithPermissionResponseDto,
  })
  @Get(':id/with-permissions')
  async findRoleByIdWithPermissions(@Param('id') id: string) {
    const data = await this.roleService.findRoleByIdWithPermissions(id);
    return {
      data,
    };
  }

  @ApiCreateEndpoint({
    summary: 'Create a new role with associated permissions',
    responseType: RoleResponseDto,
  })
  @Post()
  async createRoleWithPermissions(@Body() newRole: CreateRoleDto) {
    const data = await this.roleService.createRoleWithPermissions(newRole);
    return {
      data,
      message: 'Role created successfully',
    };
  }

  @ApiUpdateEndpoint({
    summary: 'Update an existing role and its associated permissions',
    responseType: RoleResponseDto,
  })
  @Patch(':id')
  async updateRoleWithPermissions(@Param('id') id: string, @Body() updatedRole: UpdateRoleDto) {
    const data = await this.roleService.updateRoleWithPermissions(id, updatedRole);
    return {
      data,
      message: 'Role updated successfully',
    };
  }
}
