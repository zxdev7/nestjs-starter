import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('v1');

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('API Document Starter Kit')
      .setDescription('API Document Starter Kit')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors();
  } else {
    app.enableCors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : '*',
      credentials: true,
    });
  }

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
