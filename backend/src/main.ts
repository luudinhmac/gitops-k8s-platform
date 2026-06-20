import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { LogLevel, ValidationPipe, VersioningType } from '@nestjs/common';
// CI/CD Test Trigger: 2026-05-12-17-54 (Final Validation)
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === 'production';
  const loggerLevels: LogLevel[] = isProduction
    ? ['error', 'warn']
    : ['log', 'error', 'warn', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: loggerLevels,
  });

  // Security: Helmet
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // Enable Graceful Shutdown
  app.enableShutdownHooks();

  // Set Global Prefix
  app.setGlobalPrefix('api');

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Trust proxy for accurate IP capture (Essential for rate limiting)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Use Cookie Parser
  app.use(cookieParser());

  // Enable CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Swagger Documentation
  const isSwaggerEnabled = process.env.ENABLE_SWAGGER === 'true';

  if (!isProduction || isSwaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Portfolio API')
      .setDescription('The Portfolio project API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend is running at http://localhost:${port}/api/v1`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
