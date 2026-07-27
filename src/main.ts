import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局数据校验管道
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 允许前端跨域访问
  app.enableCors();

  // Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('项目名 API')
    .setDescription('接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('服务启动: http://localhost:3000');
  console.log('API 文档: http://localhost:3000/api-docs');
}
bootstrap();
