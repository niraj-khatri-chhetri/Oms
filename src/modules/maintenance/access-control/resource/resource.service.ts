import { Injectable } from '@nestjs/common';
import { ResourceRepository } from './resource.repository';
import { CreateResourceDto, UpdateResourceDto } from './dtos/resource.dtos';

@Injectable()
export class ResourceService {
  constructor(private readonly resourceRepo: ResourceRepository) {}

  async findAllResources() {
    return await this.resourceRepo.findAllResources();
  }

  async findAllReourcesWithPermissions() {
    return await this.resourceRepo.findAllReourcesWithPermissions();
  }

  async createResource(resource: CreateResourceDto) {
    return await this.resourceRepo.createResource(resource);
  }

  async updateResource(resource: UpdateResourceDto, id: string) {
    return await this.resourceRepo.updateResource(resource, id);
  }

  async deleteResource(id: string) {
    return await this.resourceRepo.deleteResource(id);
  }
}
