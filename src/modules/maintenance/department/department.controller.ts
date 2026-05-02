import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DepartmentService } from './department.service';
import {
  CreateDepartmentDto,
  DepartmentResponseDto,
  UpdateDepartmentDto,
} from './dtos/department.dtos';
import {
  ApiDeleteEndpoint,
  ApiGetEndpoint,
  ApiUpdateEndpoint,
} from 'src/common/decorators/api-endpoint.decorator';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiGetEndpoint({
    summary: 'Get all departments',
    responseType: DepartmentResponseDto,
    isArray: true,
  })
  @RequirePermissions(PERMISSIONS.DEPARTMENT.VIEW)
  @Get()
  async findAllDepartments() {
    return this.departmentService.findAllDepartments();
  }

  @ApiGetEndpoint({
    summary: 'Get department by ID',
    responseType: DepartmentResponseDto,
  })
  @RequirePermissions(PERMISSIONS.DEPARTMENT.VIEW)
  @Get(':id')
  async findDepartmentById(@Param('id') id: string) {
    return this.departmentService.findDepartmentById(id);
  }

  @ApiGetEndpoint({
    summary: 'Creates a new department',
    responseType: DepartmentResponseDto,
  })
  @RequirePermissions(PERMISSIONS.DEPARTMENT.CREATE)
  @Post()
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    const data = await this.departmentService.createDepartment(createDepartmentDto);
    return { data, message: 'Department created successfully' };
  }

  @ApiUpdateEndpoint({
    summary: 'Updates an existing department',
    responseType: DepartmentResponseDto,
  })
  @RequirePermissions(PERMISSIONS.DEPARTMENT.UPDATE)
  @Patch(':id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    const data = await this.departmentService.updateDepartment(id, updateDepartmentDto);
    return { data, message: 'Department updated successfully' };
  }

  @ApiDeleteEndpoint({
    summary: 'Deletes a department',
    description: 'Soft deletes a department by ID',
  })
  @RequirePermissions(PERMISSIONS.DEPARTMENT.DELETE)
  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    await this.departmentService.deleteDepartment(id);
    return { message: 'Department deleted successfully' };
  }
}
