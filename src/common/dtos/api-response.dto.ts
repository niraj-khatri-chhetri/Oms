import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Operation completed successfully' })
  message?: string;

  data!: T;

  @ApiProperty({ example: 200 })
  statusCode!: number;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;
}

export class PaginatedApiResponseDto<T> extends ApiResponseDto<T[]> {
  @ApiProperty({ type: () => PaginationMetaDto })
  meta!: PaginationMetaDto;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 'Something went wrong' })
  message!: string;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: ['field must not be empty'], isArray: true, required: false })
  errors?: string[];
}
