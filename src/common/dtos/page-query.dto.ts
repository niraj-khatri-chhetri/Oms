import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export enum SortOrder { ASC = 'ASC', DESC = 'DESC' }

export class PageQueryDto {
     @IsOptional()
     @IsInt()
     @Type(() => Number)
     @Min(1)
     page: number = 1;

     @IsOptional()
     @Type(() => Number)
     @IsInt()
     @Min(1)
     @Max(100)
     limit: number = 20;

     @IsOptional()
     @IsEnum(SortOrder)
     sort: string = "createdAt";

     @IsOptional()
     @IsString()
     order?: SortOrder = SortOrder.DESC;

     search?: string;

     get skip(): number {
          return (this.page - 1) * this.limit
     }
}