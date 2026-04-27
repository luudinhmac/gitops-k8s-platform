import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: Helmet
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  }));

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
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Use Cookie Parser
  app.use(cookieParser());

  // Enable CORS
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Swagger Documentation
  const isProduction = process.env.NODE_ENV === 'production';
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
