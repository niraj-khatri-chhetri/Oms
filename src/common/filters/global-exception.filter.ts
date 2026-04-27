import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Request } from 'express'
import { mapDrizzleError } from "./db-error.map";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
     private readonly logger = new Logger(GlobalExceptionFilter.name);

     constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

     catch(exception: unknown, host: ArgumentsHost): void {

          const { httpAdapter } = this.httpAdapterHost;
          const ctx = host.switchToHttp();
          const request = ctx.getRequest<Request>()

          let status = HttpStatus.INTERNAL_SERVER_ERROR;
          let message: string = 'Internal server error';
          let errors: string[] | undefined;

          //Handle Http exception (4xx / 5xx) 
          if (exception instanceof HttpException) {
               status = exception.getStatus();
               const res = exception.getResponse();

               //Response => string or object
               if (typeof res === 'string') {
                    message = res;
               } else if (typeof res === 'object' && res !== null) {
                    const body = res as { message?: string | string[] };

                    if (Array.isArray(body.message)) {
                         message = 'Validation Failed.'
                         errors = body?.message;
                    } else {
                         message = body?.message ?? exception.message
                    }

               }

               // 4xx status codes - warning
               status < 500
                    ? this.logger.warn(`[${status}] ${request.method} ${request.url} — ${message}`)
                    : this.logger.error(`[${status}] ${request.method} ${request.url} — ${message}`, (exception as Error).stack);
          }

          //Drizzle / Db error
          else if (isDrizzleError(exception)) {
               const code = (exception as any)?.cause?.code;

               const { status: dbStatus, message: dbMessage } = mapDrizzleError(code);
               status = dbStatus;
               message = dbMessage;

               this.logger.error(`[DB] ${request.method} ${request.url} — ${message}`, (exception as Error).stack);
          }


          //Unexpected error
          else {
               this.logger.error(
                    `[UNHANDLED] ${request.method} ${request.url}`,
                    exception instanceof Error ? exception.stack : String(exception),
               );
          }

          const responseBody = {
               success: false,
               statusCode: status,
               message,
               timestamp: new Date().toISOString(),
               ...(errors && { errors }),
               path: request.url,
          };

          httpAdapter.reply(ctx.getResponse(), responseBody, status)
     }
}

const isDrizzleError = (e: unknown): e is Error => {
     return e instanceof Error && e.constructor.name === 'DrizzleQueryError'
}