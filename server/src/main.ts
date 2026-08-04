import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.getOrThrow<number>('port');
  const apiPrefix = config.getOrThrow<string>('apiPrefix');

  app.setGlobalPrefix(apiPrefix);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.enableCors({
    origin: config.getOrThrow<string[]>('corsOrigin'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mini CRM API')
    .setDescription(
      'Mijozlar, loyihalar va vazifalarni boshqarish uchun REST API. ' +
        'Himoyalangan endpointlar uchun `Authorize` tugmasi orqali access token kiriting.',
    )
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Server: http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger: http://localhost:${port}/${apiPrefix}/docs`);
}

void bootstrap();
