import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { designations } from "src/core/database/schema/maintenance/designations/designations.schema";

export type Designation = InferSelectModel<typeof designations>
export type NewDesignation = InferInsertModel<typeof designations>