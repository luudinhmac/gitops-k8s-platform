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

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Map domain errors to HTTP errors
    if (exception instanceof Error && exception.name === 'PostNotFoundException') {
      status = HttpStatus.NOT_FOUND;
    }

    // Extract error message and map custom error code
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      const resBody = exception.getResponse();
      if (typeof resBody === 'string') {
        message = resBody;
      } else if (typeof resBody === 'object' && resBody !== null) {
        message = (resBody as any).message || exception.message || 'Error';
      }

      // Map status codes to descriptive error codes
      if (status === HttpStatus.UNAUTHORIZED) {
        errorCode = 'UNAUTHORIZED';
      } else if (status === HttpStatus.NOT_FOUND) {
        errorCode = 'NOT_FOUND';
      } else if (status === HttpStatus.FORBIDDEN) {
        errorCode = 'FORBIDDEN';
      } else if (status >= 400 && status < 500) {
        errorCode = 'BAD_REQUEST';
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      if (exception.name === 'PostNotFoundException') {
        errorCode = 'NOT_FOUND';
      }
    }

    const errorResponse = {
      message: message,
      code: errorCode,
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

