import { departments } from 'src/core/database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// Basic types for Department entity
export type Department = InferSelectModel<typeof departments>;
export type NewDepartment = InferInsertModel<typeof departments>;
export type UpdateDepartment = Partial<NewDepartment>;

// Modified Response type to exclude deletedAt and createdBy fields
export type DepartmentResponse = Omit<Department, 'deletedAt' | 'createdBy'>;
