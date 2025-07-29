import {
  RedisModule as liaoliaoRedisModule,
  RedisModuleAsyncOptions,
} from '@liaoliaots/nestjs-redis';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { RedisService } from './redis.service';

const redis_options = {
  retryStrategy: (times) => {
    // 无限重连，但重连间隔越来越长（指数退避）
    return Math.min(times * 1000, 10000); // 最多间隔 10 秒
  },
};

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static forRoot(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        liaoliaoRedisModule.forRootAsync(
          { ...options, ...redis_options },
          isGlobal,
        ),
      ],
      providers: [RedisService],
      exports: [RedisService],
    };
  }

  static forRootAsync(
    options: RedisModuleAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    return {
      module: RedisModule,
      imports: [
        liaoliaoRedisModule.forRootAsync(
          { ...options, ...redis_options },
          isGlobal,
        ),
      ],
      providers: [RedisService],
      exports: [RedisService],
    };
  }
}
