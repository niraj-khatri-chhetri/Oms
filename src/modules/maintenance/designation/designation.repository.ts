import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE, type DrizzleDB } from "src/core/database/database.provider";
import { NewDesignation } from "./types/designation.types";
import { designations } from "src/core/database/schema/maintenance/designations/designations.schema";


@Injectable()

export class DesignationRepository {
     constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) { }

     async createDesignation(newDesignation: NewDesignation): Promise<any> {
          const data = await this.db.insert(designations).values(newDesignation).returning();
          return data;
     }

}