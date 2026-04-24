import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Graceful Shutdown
  app.enableShutdownHooks();

  // Set Global Prefix
  app.setGlobalPrefix('api');

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

  // Swagger Documentation - Only enabled in non-production or when explicitly enabled
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
  console.log(`Backend is running at http://localhost:${port}/api`);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
