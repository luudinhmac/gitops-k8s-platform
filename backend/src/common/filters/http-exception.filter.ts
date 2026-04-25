import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse = {
      message: typeof message === 'string' ? message : (message as any).message || 'Error',
      code: typeof message === 'object' ? (message as any).error || 'INTERNAL_ERROR' : 'INTERNAL_ERROR',
      status: status,
      timestamp: new Date().toISOString(),
      path: (request as any).url,
    };

    // Log the error
    if (status >= 500) {
      this.logger.error(
        `${(request as any).method} ${(request as any).url} ${status} - Error: ${
          exception instanceof Error ? exception.message : 'Unknown error'
        }`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(`${(request as any).method} ${(request as any).url} ${status} - ${JSON.stringify(message)}`);
    }

    response.status(status).json(errorResponse);
  }
}
