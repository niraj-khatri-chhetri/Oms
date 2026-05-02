import { Injectable } from '@nestjs/common';
import { NewDesignation } from './types/designation.types';
import { DesignationRepository } from './designation.repository';
import { RoleResponseDto } from '../access-control/role/dtos/role.dtos';
import { CreateDesignationDto } from './dtos/designation.dtos';
import { UserResponseDto } from '../user/dtos/user.dtos';
import { UserResponse } from '../user/types/user.types';

@Injectable()
export class DesignationService {
     constructor(private readonly designationRepo: DesignationRepository) { }

     async createDesignation(newDesignation: CreateDesignationDto): Promise<RoleResponseDto> {
          const data = await this.designationRepo.createDesignation(newDesignation);
          return data;
     }

     async findAllDesignations(): Promise<RoleResponseDto[]> {
          const data = await this.designationRepo.findAllDesignations();
          return data;
     }

     async findUsersByDesignationId(designationId: string): Promise<UserResponse[]> {
          const data = await this.designationRepo.findUsersByDesignationId(designationId);
          return data;
     }
}
