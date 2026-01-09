import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message } = this.mapExceptionToHttp(exception);
    const stack = (exception as any)?.stack || null;

    const errorResponse = this.buildErrorResponse({
      statusCode: status,
      path: request.url,
      message,
      code,
      timestamp: new Date().toISOString(),
    });

    Logger.error(message, stack, 'GlobalExceptionFilter');
    response.status(status).json({ error: errorResponse });
  }

  private mapExceptionToHttp(exception: unknown): {
    status: number;
    code?: string;
    message: string | string[];
  } {
    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();

      if (typeof response === 'string') {
        return { status, message: response };
      }

      const res = response as Record<string, any>;
      return {
        status,
        code: res.error,
        message: res.message || res.error || exception.message,
      };
    }

    if (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.BAD_REQUEST
    ) {
      const response = exception.getResponse();
      if (
        typeof response === 'object' &&
        (response as any).message &&
        Array.isArray((response as any).message)
      ) {
        return {
          status: HttpStatus.BAD_REQUEST,
          code: 'VALIDATION_ERROR',
          message: (response as any).message,
        };
      }
    }

    // Handle Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception);
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        status: HttpStatus.BAD_REQUEST,
        code: 'PRISMA_VALIDATION_ERROR',
        message: 'Argument is invalid',
      };
    }

    if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'PRISMA_UNKNOWN_REQUEST',
        message: exception.message,
      };
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'PRISMA_INIT_ERROR',
        message: exception.message,
      };
    }

    if (exception instanceof Prisma.PrismaClientRustPanicError) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'PRISMA_RUST_PANIC',
        message: 'Unexpected internal error occurred in Prisma engine.',
      };
    }

    // Fallback for other unknown errors
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: (exception as any)?.message || 'Internal server error',
    };
  }

  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
  ): {
    status: number;
    code: string;
    message: string;
  } {
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

  private buildErrorResponse(data: {
    statusCode: number;
    path: string;
    code?: string;
    message: string | string[];
    timestamp: string;
  }) {
    if (Array.isArray(data.message)) {
      return data.message.map((msg) => ({
        ...data,
        message: msg,
      }));
    }

    return data;
  }
}
