import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { PaginationInterceptor } from './pagination.interceptor';
import { Readable } from 'stream';
import { Response } from 'express';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const reflector = new Reflector();
    const skip = reflector.get<boolean>('skipTransform', context.getHandler());
    if (skip) {
      return next.handle(); // skip transform
    }

    const classInterceptors = reflector.get(
      '__interceptors__',
      context.getClass(),
    );
    const handlerInterceptors = reflector.get(
      '__interceptors__',
      context.getHandler(),
    );

    if (
      classInterceptors?.some(
        (interceptor) => interceptor instanceof ResponseInterceptor,
      ) &&
      handlerInterceptors?.some(
        (interceptor) => interceptor instanceof PaginationInterceptor,
      )
    ) {
      return next.handle();
    }

    return next.handle().pipe(
      map((content) => {
        //Bypass untuk StreamableFile
        if (content instanceof StreamableFile) return content;
        
        if (!content || typeof content !== 'object') {
          return content;
        }

        const message = content?.message ? content.message : null;
        message && delete content?.message;

        const data = content?.data ? content.data : content;
        
        const safeData =
           data && typeof data === 'object' ? data : {};

        const response = {
          status: 'success',
          meta: null,
          message,
          data: Object.keys(safeData).length ? safeData : null,
          links: null,
          timestamp: new Date().toISOString(),
        };

        const rows = content?.data;
        if (Array.isArray(rows) && rows.length > 0) {
          response.data = rows;
        }

        const meta = content?.meta;
        if (meta) {
          response.meta = meta;
          delete content.meta;
        }

        const links = content?.links;
        if (links) {
          response.links = links;
          delete content.links;
        }

        return Object.fromEntries(
          Object.entries(response).filter(([, v]) => v !== null),
        );
      }),
    );
  }
}
