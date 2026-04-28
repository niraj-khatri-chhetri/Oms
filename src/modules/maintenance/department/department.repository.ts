import { Inject, Injectable } from '@nestjs/common';
import { and, isNull } from 'drizzle-orm';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { departments } from 'src/core/database/schema';
import { eq } from 'drizzle-orm';
import {
  Department,
  DepartmentResponse,
  NewDepartment,
  UpdateDepartment,
} from './types/department.types';

@Injectable()
export class DepartmentRepository {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findAll(): Promise<DepartmentResponse[]> {
    const data = await this.db.query.departments.findMany({
      where: isNull(departments.deletedAt),
      columns: {
        createdBy: false,
        deletedAt: false,
      },
    });

    return data;
  }

  async findById(id: string): Promise<DepartmentResponse | null> {
    const data = await this.db.query.departments.findFirst({
      where: and(eq(departments.id, id), isNull(departments.deletedAt)),
      columns: {
        createdBy: false,
        deletedAt: false,
      },
    });

    return data || null;
  }

  async createDepartment(newDepartment: NewDepartment): Promise<DepartmentResponse> {
    const [data] = await this.db.insert(departments).values(newDepartment).returning();

    const { deletedAt, createdBy, ...rest } = data;
    return rest;
  }

  async updateDepartment(
    id: string,
    updatedDepartment: UpdateDepartment,
  ): Promise<DepartmentResponse> {
    const [data] = await this.db
      .update(departments)
      .set(updatedDepartment)
      .where(and(eq(departments.id, id), isNull(departments.deletedAt)))
      .returning();

    const { deletedAt, createdBy, ...rest } = data;
    return rest;
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.db
      .update(departments)
      .set({ deletedAt: new Date() })
      .where(and(eq(departments.id, id), isNull(departments.deletedAt)));
  }
}
