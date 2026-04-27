import { resources, permissions } from 'src/core/database/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Resource = InferSelectModel<typeof resources>;
export type NewResource = InferInsertModel<typeof resources>;
export type UpdateResource = Partial<NewResource>;

export type ResourceWithPermissions = Resource & {
  //   permissions: Permission[];
};
