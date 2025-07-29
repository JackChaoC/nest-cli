import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import chalk from 'chalk';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置访问频率
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );

  const config = app.get(ConfigService);

  // 设置 api 访问前缀
  const prefix = config.get<string>('app.prefix');
  app.setGlobalPrefix(prefix); // app.setGlobalPrefix('api/v1');

  // web 安全，防常见漏洞
  // 注意： 开发环境如果开启 nest static module 需要将 crossOriginResourcePolicy 设置为 false 否则 静态资源 跨域不可访问
  // { crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' }, crossOriginResourcePolicy: false }
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
    }),
  );

  // ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剔除没有在 DTO 里定义的字段
      forbidNonWhitelisted: true, // 如果有额外字段，直接抛错
      transform: true, // 启用 class-transformer
    }),
  );

  // Swagger 配置
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('API 文档示例')
      .setDescription('这是一个自动生成的接口文档')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  // 获取配置端口
  const port = config.get<number>('app.port') || 3000
  await app.listen(port);

  const fileUploadLocationConfig =
    config.get<string>('app.file.location') || '../upload';
  const fileUploadBasePath = path.normalize(
    path.isAbsolute(fileUploadLocationConfig)
      ? `${fileUploadLocationConfig}`
      : path.join(process.cwd(), `${fileUploadLocationConfig}`),
  );

  Logger.log(
    chalk.green(`\nNest-Cli 服务启动成功`) + '\n',
    +
    chalk.green('上传文件存储路径') +
    `        ${fileUploadBasePath}` +
    '\n' +
    chalk.green('服务地址') +
    `                http://localhost:${port}${prefix}/` +
    '\n' +
    chalk.green('swagger 文档地址        ') +
    `http://localhost:${port}${prefix}/docs/`,
  );
}
bootstrap();
