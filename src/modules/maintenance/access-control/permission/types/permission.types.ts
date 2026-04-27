import { permissions } from 'src/core/database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Permission = InferSelectModel<typeof permissions>;
export type NewPermission = InferInsertModel<typeof permissions>;
export type UpdatePermission = Partial<NewPermission>;
