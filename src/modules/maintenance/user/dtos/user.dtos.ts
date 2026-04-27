import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// ─── Request DTOs ─────────────────────────────────────────────────────────

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['email'] as const)) {}

// ─── Response DTOs ─────────────────────────────────────────────────────────

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ example: 'Suman' })
  @Expose()
  firstName!: string;

  @ApiProperty({ example: 'Magar' })
  @Expose()
  lastName!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  @Expose()
  updatedAt!: Date;
}
