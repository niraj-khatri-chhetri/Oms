import { applyDecorators, HttpCode, HttpStatus, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  ErrorResponseDto,
  PaginatedApiResponseDto,
  PaginationMetaDto,
} from '../dtos/api-response.dto';

interface ApiEndpointOptions {
  summary: string;
  description?: string;
  /** HTTP status on success, defaults to 200 */
  status?: HttpStatus;
  /** The DTO type returned in `data` */
  responseType?: Type<unknown>;
  /** Wrap in a paginated envelope instead of a plain one */
  paginated?: boolean;
  /** Override the response description */
  responseDescription?: string;
  /** Mark endpoint as deprecated */
  deprecated?: boolean;
  /** Include default 401/403 responses (set false to disable) */
  includeAuthErrors?: boolean;

  isArray?: boolean;

  // Error responses are explicit and optional
  errors?: {
    status: 400 | 401 | 403 | 404 | 409 | 422 | 500;
    description: string;
    example?: Record<string, unknown>;
  }[];
}

/**
 * Composes ApiOperation + success/error ApiResponse decorators into a single decorator.
 * Use this as the baseline for every endpoint; layer ApiBody/ApiParam on top when needed.
 */
export function ApiEndpoint(options: ApiEndpointOptions) {
  const {
    summary,
    description,
    status = HttpStatus.OK,
    responseType,
    paginated = false,
    responseDescription = 'Successful response',
    deprecated = false,
    isArray = false,
    includeAuthErrors = true,
    errors = [],
  } = options;

  const mergedErrors = [...errors];
  if (includeAuthErrors) {
    if (!mergedErrors.some((e) => e.status === 401)) {
      mergedErrors.push({ status: 401, description: 'Unauthorized' });
    }
    if (!mergedErrors.some((e) => e.status === 403)) {
      mergedErrors.push({ status: 403, description: 'Forbidden' });
    }
  }

  const extraModels = responseType
    ? [ApiExtraModels(ApiResponseDto, PaginatedApiResponseDto, responseType, PaginationMetaDto)]
    : [ApiExtraModels(ApiResponseDto, PaginatedApiResponseDto, PaginationMetaDto)];

  const successSchema = responseType
    ? paginated
      ? {
          allOf: [
            { $ref: getSchemaPath(PaginatedApiResponseDto) },
            {
              properties: {
                data: { type: 'array', items: { $ref: getSchemaPath(responseType) } },
              },
            },
          ],
        }
      : {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                data: isArray
                  ? { type: 'array', items: { $ref: getSchemaPath(responseType) } }
                  : { $ref: getSchemaPath(responseType) },
              },
            },
          ],
        }
    : { $ref: getSchemaPath(ApiResponseDto) };

  const errorResponses = mergedErrors.map(({ status, description, example }) =>
    ApiResponse({
      status,
      description,
      schema: {
        example: example ?? {
          success: false,
          statusCode: status,
          message: description,
        },
      },
    }),
  );

  return applyDecorators(
    ...extraModels,
    HttpCode(status),
    ApiOperation({ summary, description, deprecated }),
    ApiResponse({
      status,
      description: responseDescription,
      schema: successSchema,
    }),
    ...errorResponses,
  );
}

// ─── Specialised shorthands ────────────────────────────────────────────────

export function ApiGetEndpoint(options: Omit<ApiEndpointOptions, 'status'>) {
  return ApiEndpoint({ ...options, status: HttpStatus.OK });
}

export function ApiCreateEndpoint(options: Omit<ApiEndpointOptions, 'status'>) {
  return ApiEndpoint({
    ...options,
    status: HttpStatus.CREATED,
    responseDescription: 'Resource created',
  });
}

export function ApiUpdateEndpoint(options: Omit<ApiEndpointOptions, 'status'>) {
  return ApiEndpoint({
    ...options,
    status: HttpStatus.OK,
    responseDescription: 'Resource updated',
  });
}

export function ApiDeleteEndpoint(options: Omit<ApiEndpointOptions, 'status'>) {
  return ApiEndpoint({
    ...options,
    status: HttpStatus.OK,
    responseDescription: 'Resource deleted',
  });
}

// ─── Parameter shorthands ──────────────────────────────────────────────────

export function ApiIdParam(description = 'Resource UUID') {
  return ApiParam({
    name: 'id',
    description,
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  });
}

export function ApiFileUpload(fieldName = 'file') {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: { type: 'string', format: 'binary' },
        },
      },
    }),
  );
}

export function ApiPaginationQuery() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' }),
    ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] }),
  );
}
