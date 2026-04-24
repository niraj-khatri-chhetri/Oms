import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((response) => {
        if (response && typeof response === 'object' && 'success' in response) {
          return response;
        }

        const { data, meta, message } =
          response && typeof response === 'object' ? (response as any) : { data: response };

        return {
          success: true,
          statusCode: res.statusCode,
          ...(message && { message }),
          ...(meta && { meta }),
          data: data ?? response,
        };
      }),
    );
  }
}
