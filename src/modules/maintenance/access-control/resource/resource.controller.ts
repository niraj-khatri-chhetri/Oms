import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ApiCreateEndpoint,
  ApiDeleteEndpoint,
  ApiGetEndpoint,
  ApiUpdateEndpoint,
} from 'src/common/decorators/api-endpoint.decorator';

import { ResourceService } from './resource.service';
import {
  CreateResourceDto,
  ResourceResponseDto,
  ResourceWithPermissionsResponseDto,
  UpdateResourceDto,
} from './dtos/resource.dtos';

@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @ApiGetEndpoint({
    summary: 'Get all resources',
    responseType: ResourceResponseDto,
    isArray: true,
  })
  @Get()
  async findAllResources() {
    return await this.resourceService.findAllResources();
  }

  @ApiGetEndpoint({
    summary: 'Get all resources with their associated permissions',
    responseType: ResourceWithPermissionsResponseDto,
    isArray: true,
  })
  @Get('with-permissions')
  async findAllReourcesWithPermissions() {
    return await this.resourceService.findAllReourcesWithPermissions();
  }

  @ApiCreateEndpoint({
    summary: 'Create a new resource',
    responseType: ResourceResponseDto,
  })
  @Post()
  async createResource(@Body() resource: CreateResourceDto) {
    const data = await this.resourceService.createResource(resource);
    return {
      data,
      message: 'Resource created successfully',
    };
  }

  @ApiUpdateEndpoint({
    summary: 'Update an existing resource',
    responseType: ResourceResponseDto,
  })
  @Patch(':id')
  async updateResource(@Body() resource: UpdateResourceDto, @Param('id') id: string) {
    const data = await this.resourceService.updateResource(resource, id);
    return {
      data,
      message: 'Resource updated successfully',
    };
  }

  @ApiDeleteEndpoint({
    summary: 'Delete a resource',
    responseType: ResourceResponseDto,
  })
  @Delete(':id')
  async deleteResource(@Param('id') id: string) {
    const data = await this.resourceService.deleteResource(id);
    return {
      data,
      message: 'Resource deleted successfully',
    };
  }
}
