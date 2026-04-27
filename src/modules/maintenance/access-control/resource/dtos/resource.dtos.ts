// ─── Request DTOs ─────────────────────────────────────────────────────────

import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, Max, MaxLength } from 'class-validator';
import { PermissionResponseDto } from '../../permission/dtos/permission.dtos';

// ─── Request DTOs ─────────────────────────────────────────────────────────

export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource name',
    example: 'User Management',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Resource description',
    example: 'Manages user accounts and permissions',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @ApiProperty({
    description: 'Resource code',
    example: 'user',
  })
  @IsString()
  @MaxLength(50)
  code!: string;
}

export class UpdateResourceDto extends PartialType(CreateResourceDto) {}

// ─── Response DTOs ─────────────────────────────────────────────────────────

export class ResourceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Resource name',
    example: 'User Management',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Resource description',
    example: 'Manages user accounts and permissions',
  })
  @Expose()
  description!: string;

  @ApiProperty({
    description: 'Resource code',
    example: 'user',
  })
  @Expose()
  code!: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt!: Date;
}

export class ResourceWithPermissionsResponseDto extends ResourceResponseDto {
  @ApiProperty({
    description: 'List of permissions associated with the resource',
    type: () => [OmitType(PermissionResponseDto, ['createdAt', 'updatedAt'] as const)],
  })
  @Expose()
  permissions!: Omit<PermissionResponseDto, 'createdAt' | 'updatedAt'>[];
}
