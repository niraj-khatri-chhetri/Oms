import { Module } from '@nestjs/common';
import { ResourceModule } from './resource/resource.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [ResourceModule, PermissionModule, RoleModule],
})
export class AccessControlModule {}
