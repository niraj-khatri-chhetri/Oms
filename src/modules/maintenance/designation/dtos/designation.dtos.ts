import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

// ─── Request DTOs ─────────────────────────────────────────────────────────

export class CreateDesignationDto {
     @ApiProperty({
          example: 'Developer',
          minLength: 1,
          maxLength: 50,
     })
     @IsString()
     @IsNotEmpty()
     @MinLength(1)
     @MaxLength(50)
     name!: string;

     @ApiProperty({
          example: 'Developer responsible for writing and maintaining code',
          minLength: 1,
          maxLength: 255,
     })
     @IsString()
     @IsNotEmpty()
     @MinLength(1)
     @MaxLength(255)
     description!: string;

     // @ApiProperty({
     //      type: String,
     //      format: 'date-time',
     //      example: '2026-01-15T12:00:00.000Z',
     // })
     // @Expose()
     // createdAt!: Date;

     // @ApiProperty({
     //      type: String,
     //      format: 'date-time',
     //      nullable: true,
     //      example: '2026-01-20T08:30:00.000Z',
     // })
     // @Expose()
     // updatedAt!: Date | null;

}

// ─── Response DTOs ─────────────────────────────────────────────────────────
