import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message } = this.mapPrismaError(exception);

    const errorResponse = {
      statusCode: status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json({ error: errorResponse });
  }

  private mapPrismaError(exception: any): {
    status: number;
    code: string;
    message: string;
  } {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return {
            status: HttpStatus.CONFLICT,
            code: 'PRISMA_CONFLICT',
            message: `Unique constraint failed on ${exception.meta?.target}`,
          };
        case 'P2025':
          return {
            status: HttpStatus.NOT_FOUND,
            code: 'PRISMA_NOT_FOUND',
            message: `${exception.meta?.modelName ?? 'Record'} not found`,
          };
        case 'P2003':
          return {
            status: HttpStatus.BAD_REQUEST,
            code: 'PRISMA_FOREIGN_KEY',
            message: `Foreign key constraint failed on ${exception.meta?.field_name}`,
          };
        default:
          return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            code: 'PRISMA_KNOWN_ERROR',
            message: exception.message,
          };
      }
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'PRISMA_VALIDATION_ERROR',
        message: 'Invalid data passed to Prisma.',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'PRISMA_ERROR',
      message: exception.message,
    };
  }
}
