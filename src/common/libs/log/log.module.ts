import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          targets: [
            process.env.NODE_ENV === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                }
              : {
                  level: 'info',
                  target: 'pino-roll',
                  options: {
                    file: join('logs', 'log'), // 使用 %DATE% 占位符
                    frequency: 'daily', // 每天滚动
                    mkdir: true,
                    dateFormat: 'yyyy-MM-dd', // 日期格式
                  },
                },
          ],
        },
      },
    }),
  ],
})
export class LogModule {}
