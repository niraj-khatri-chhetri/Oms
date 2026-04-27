import { HttpStatus } from '@nestjs/common';

export const PG_ERROR_CODES = {
     UNIQUE_VIOLATION: '23505',
     FOREIGN_KEY_VIOLATION: '23503',
     NOT_NULL_VIOLATION: '23502',
     CHECK_VIOLATION: '23514',
     CONNECTION_FAILURE: '08001',
     CONNECTION_EXCEPTION: '08006',
} as const;

export function mapDrizzleError(code: string): { status: number; message: string } {
     switch (code) {
          case PG_ERROR_CODES.UNIQUE_VIOLATION:
               return { status: HttpStatus.CONFLICT, message: 'Resource already exists' };
          case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION:
               return { status: HttpStatus.BAD_REQUEST, message: 'Referenced resource does not exist' };
          case PG_ERROR_CODES.NOT_NULL_VIOLATION:
               return { status: HttpStatus.BAD_REQUEST, message: 'Missing required field' };
          case PG_ERROR_CODES.CHECK_VIOLATION:
               return { status: HttpStatus.BAD_REQUEST, message: 'Value violates check constraint' };
          case PG_ERROR_CODES.CONNECTION_FAILURE:
          case PG_ERROR_CODES.CONNECTION_EXCEPTION:
               return { status: HttpStatus.SERVICE_UNAVAILABLE, message: 'Database connection failed' };
          default:
               return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Database error' };
     }
}