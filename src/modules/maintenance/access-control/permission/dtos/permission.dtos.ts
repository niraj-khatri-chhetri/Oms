import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'Resource ID (User Management, Role Management, etc.)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  resourceId!: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'Create User',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows creating new users',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @ApiProperty({
    description: 'Permission key',
    example: 'user:create',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key!: string;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}

export class PermissionResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({
    description: 'Permission name',
    example: 'Create User',
  })
  @Expose()
  name!: string;

  @ApiProperty({
    description: 'Permission description',
    example: 'Allows creating new users',
  })
  @Expose()
  description!: string;

  @ApiProperty({
    description: 'Permission key',
    example: 'user:create',
  })
  @Expose()
  key!: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @Expose()
  updatedAt!: Date;
}
