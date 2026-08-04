import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

/**
 * Serverless muhitda Swagger UI ning statik fayllari paketga tushmaydi va 404
 * beradi, shuning uchun ular CDN'dan yuklanadi.
 */
const SWAGGER_CDN_HOST = 'https://cdn.jsdelivr.net';
const SWAGGER_CDN = `${SWAGGER_CDN_HOST}/npm/swagger-ui-dist@5.29.0`;

function renderSwaggerPage(specUrl: string): string {
  return `<!doctype html>
<html lang="uz">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mini CRM API</title>
    <link rel="stylesheet" href="${SWAGGER_CDN}/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${SWAGGER_CDN}/swagger-ui-bundle.js"></script>
    <script src="${SWAGGER_CDN}/swagger-ui-standalone-preset.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '${specUrl}',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
        persistAuthorization: true,
      });
    </script>
  </body>
</html>`;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = config.getOrThrow<number>('port');
  const apiPrefix = config.getOrThrow<string>('apiPrefix');

  app.setGlobalPrefix(apiPrefix);

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      // Swagger UI fayllari CDN'dan keladi, CSP ularga ruxsat berishi kerak.
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          // Faqat host yoziladi: yo'l ko'rsatilsa CSP aynan o'sha manzilga
          // ruxsat beradi va ichidagi fayllar bloklanadi.
          'script-src': ["'self'", "'unsafe-inline'", SWAGGER_CDN_HOST],
          'style-src': ["'self'", "'unsafe-inline'", SWAGGER_CDN_HOST],
          'img-src': ["'self'", 'data:', SWAGGER_CDN_HOST],
        },
      },
    }),
  );
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
  const specPath = `/${apiPrefix}/docs-json`;
  const httpAdapter = app.getHttpAdapter();

  // SwaggerModule.setup() o'rniga sahifani o'zimiz beramiz — u statik fayllarni
  // diskdan o'qiydi, serverless paketda esa ular yo'q (404 va bo'sh sahifa).
  httpAdapter.get(specPath, (_req: Request, res: Response) => res.json(document));
  httpAdapter.get(`/${apiPrefix}/docs`, (_req: Request, res: Response) =>
    res.type('html').send(renderSwaggerPage(specPath)),
  );

  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`Server:  http://localhost:${port}/${apiPrefix}`);
  logger.log(`Swagger: http://localhost:${port}/${apiPrefix}/docs`);
}

void bootstrap();
