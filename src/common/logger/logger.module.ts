import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const isDevelopment = configService.get('NODE_ENV') === 'development';

        const transports: winston.transport[] = [];

        // Console transport para desenvolvimento
        if (isDevelopment || !isProduction) {
          transports.push(
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.colorize({ all: true }),
                winston.format.printf((info: unknown) => {
                  const i =
                    (info as Record<string, unknown> | undefined) || undefined;
                  const timestamp =
                    typeof i?.timestamp === 'string' ? i.timestamp : undefined;
                  const level =
                    typeof i?.level === 'string' ? i.level : undefined;
                  const message =
                    typeof i?.message === 'string' ? i.message : undefined;
                  const context = i?.context;
                  const trace = i?.trace;

                  const ctx = context
                    ? typeof context === 'string'
                      ? context
                      : JSON.stringify(context)
                    : 'Application';
                  const t = trace
                    ? `\n${typeof trace === 'string' ? trace : JSON.stringify(trace)}`
                    : '';
                  return `${timestamp ?? ''} [${ctx}] ${level ?? ''}: ${message ?? ''}${t}`;
                }),
              ),
            }),
          );
        }

        // File transports para produção e desenvolvimento
        transports.push(
          // Logs de erro
          new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json(),
            ),
          }),
          // Logs combinados
          new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.errors({ stack: true }),
              winston.format.json(),
            ),
          }),
        );

        return {
          level: isProduction ? 'info' : 'debug',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          transports,
          exceptionHandlers: [
            new DailyRotateFile({
              filename: 'logs/exceptions-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
            }),
          ],
          rejectionHandlers: [
            new DailyRotateFile({
              filename: 'logs/rejections-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              maxSize: '20m',
              maxFiles: '14d',
            }),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
