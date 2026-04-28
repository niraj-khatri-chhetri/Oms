import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

// ─── Request DTOs ─────────────────────────────────────────────────────────

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department name',
    example: 'Information Technology',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Department description',
    example: 'This is the IT department responsible for managing technology and infrastructure.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  description!: string;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}

// ─── Response DTOs ─────────────────────────────────────────────────────────

export class DepartmentResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Information Technology' })
  name!: string;

  @ApiProperty({
    example: 'This is the IT department responsible for managing technology and infrastructure.',
  })
  description!: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt!: Date | null;
}
