import { Module } from '@nestjs/common';

import { PermissionRepository } from './permission/permission.repository';
import { PermissionService } from './permission/permission.service';
import { PermissionController } from './permission/permission.controller';

import { ResourceRepository } from './resource/resource.repository';
import { ResourceService } from './resource/resource.service';
import { ResourceController } from './resource/resource.controller';

import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { RoleRepository } from './role/role.repository';

@Module({
  providers: [
    ResourceRepository,
    ResourceService,
    PermissionRepository,
    PermissionService,
    RoleRepository,
    RoleService,
  ],
  controllers: [ResourceController, PermissionController, RoleController],
  exports: [PermissionService, ResourceService, RoleService],
})
export class AccessControlModule {}
