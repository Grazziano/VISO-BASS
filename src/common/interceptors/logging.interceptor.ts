import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // Log da requisição
    this.logger.log({
      message: 'Incoming request',
      method,
      url,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const { statusCode } = response;

        // Log da resposta bem-sucedida
        this.logger.log({
          message: 'Request completed',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          ip,
          timestamp: new Date().toISOString(),
        });
      }),
      catchError((err: unknown) => {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Normalize error information safely
        // Normalize error information safely - avoid accessing unknown members directly
        const errorMessage: string = (() => {
          try {
            if (typeof err === 'object' && err !== null)
              return JSON.stringify(err);
            return String(err);
          } catch {
            return String(err);
          }
        })();
        const errorStack: string | undefined = undefined;
        const statusCode = 500;

        // Log do erro
        this.logger.error({
          message: 'Request failed',
          method,
          url,
          statusCode,
          duration: `${duration}ms`,
          error: errorMessage,
          stack: errorStack,
          ip,
          timestamp: new Date().toISOString(),
        });

        throw err;
      }),
    );
  }
}
