import { Module } from '@nestjs/common';
import { UserModule } from './system/user/user.module';
import { RolesModule } from './system/roles/roles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/index';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModule } from './common/libs/redis/redis.module';
import { RedisClientOptions } from '@liaoliaots/nestjs-redis';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { AuthModule } from './system/auth/auth.module';
import { RolesGuard } from './common/guard/roles.guard';
import { JwtAuthGuard } from './common/guard/jwt-auth.guard';
import { LogModule } from './common/libs/log/log.module';
import {
  ServeStaticModule,
  ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { OssModule } from './system/oss/oss.module';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
      // validationSchema: Joi.object({
      //   APP_PORT: Joi.number().default(3000),
      // }),
    }),
    // 服务静态化, 生产环境最好使用 nginx 做资源映射， 可以根据环境配置做区分
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const fileUploadLocationConfig =
          config.get<string>('app.file.location') || '../upload';
        const rootPath = path.isAbsolute(fileUploadLocationConfig)
          ? `${fileUploadLocationConfig}`
          : path.join(process.cwd(), `${fileUploadLocationConfig}`);

        console.log(`静态资源路径: ${rootPath}`);

        return [
          {
            rootPath,
            exclude: [`${config.get('app.prefix')}`],
            serveRoot: config.get('app.file.serveRoot'),
            serveStaticOptions: {
              cacheControl: true,
            },
          },
        ] as ServeStaticModuleOptions[];
      },
    }),
    // 数据库
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get('db.type'),
          autoLoadEntities: true,
          ...config.get(`db.${config.get('db.type')}`),
          // cache: {
          //   type: 'ioredis',
          //   ...config.get('redis'),
          //   alwaysEnabled: true,
          //   duration: 3 * 1000, // 缓存3s
          // },
        } as TypeOrmModuleOptions;
      },
    }),
    // RedisModule.forRootAsync(
    //   {
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: (config: ConfigService) => {
    //       return {
    //         closeClient: true,
    //         readyLog: true,
    //         errorLog: true,
    //         config: config.get<RedisClientOptions>('redis'),
    //       };
    //     },
    //   },
    //   true,
    // ),
    LogModule,
    AuthModule,
    UserModule,
    RolesModule,
    OssModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    HttpExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
