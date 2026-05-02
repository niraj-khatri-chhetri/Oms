import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE, type DrizzleDB } from "src/core/database/database.provider";
import { NewDesignation } from "./types/designation.types";
import { designations } from "src/core/database/schema/maintenance/designations/designations.schema";
import { DesignationResponse } from "./dtos/designation.dtos";
import { users } from "src/core/database/schema";
import { eq } from "drizzle-orm";
import { UserResponse } from "../user/types/user.types";


@Injectable()

export class DesignationRepository {
     constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

     async createDesignation(newDesignation: NewDesignation): Promise<DesignationResponse> {
          const data = await this.db.insert(designations).values(newDesignation).returning();
          return data[0];
     }

     async findAllDesignations(): Promise<DesignationResponse[]> {
          const data = await this.db.select().from(designations);
          return data;
     }

     async findUsersByDesignationId(designationId: string): Promise<any[]> {
          // const data = await this.db.select().from(users).where(eq(users.designationId, designationId));
          const data = await this.db.select({
               id: users.id,
               firstName: users.firstName,
               lastName: users.lastName,
               email: users.email,

               designation: {
                    id: designations.id,
                    name: designations.name,
                    description: designations.description,
               },
          }).from(users).leftJoin(designations, eq(users.designationId, designations.id)).where(eq(designations.id, designationId));
          return data;
     }

}