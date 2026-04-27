import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';

// ─── Request DTOs ─────────────────────────────────────────────────────────

export class CreateRoleDto {
  @ApiProperty({
    example: 'Administrator',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    example: 'Role with full access to system configuration',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  description!: string;

  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  permissions!: string[];
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

// ─── Response DTOs ─────────────────────────────────────────────────────────

export class RoleResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'Administrator' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 'Role with full access to system configuration' })
  @Expose()
  description!: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-01-15T12:00:00.000Z',
  })
  @Expose()
  createdAt!: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    nullable: true,
    example: '2026-01-20T08:30:00.000Z',
  })
  @Expose()
  updatedAt!: Date | null;
}

export class RoleWithPermissionResponseDto extends RoleResponseDto {
  @ApiProperty({
    type: [String],
    format: 'uuid',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @Expose({ name: 'rolesPermissions' })
  @Transform(({ value }) => {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return [];
    }
    return value.map((p: { permissionId: string }) => p.permissionId);
  })
  permissions!: string[];
}
