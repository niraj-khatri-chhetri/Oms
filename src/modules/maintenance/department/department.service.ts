import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from './department.repository';
import {
  CreateDepartmentDto,
  DepartmentResponseDto,
  UpdateDepartmentDto,
} from './dtos/department.dtos';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentRepo: DepartmentRepository) {}

  async findAllDepartments(): Promise<DepartmentResponseDto[]> {
    return this.departmentRepo.findAll();
  }

  async findDepartmentById(id: string): Promise<DepartmentResponseDto | null> {
    return this.departmentRepo.findById(id);
  }

  async createDepartment(createDepartmentDto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
    return this.departmentRepo.createDepartment(createDepartmentDto);
  }

  async updateDepartment(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    return this.departmentRepo.updateDepartment(id, updateDepartmentDto);
  }

  async deleteDepartment(id: string): Promise<void> {
    return this.departmentRepo.deleteDepartment(id);
  }
}
