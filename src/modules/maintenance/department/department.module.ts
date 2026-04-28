import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentRepository } from './department.repository';

@Module({
  providers: [DepartmentRepository, DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
