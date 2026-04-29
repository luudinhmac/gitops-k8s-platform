import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function generate() {
  const app = await NestFactory.create(AppModule);
  
  // Set Global Prefix (match main.ts)
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('The Portfolio project API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  const outputPath = path.resolve(process.cwd(), 'swagger-spec.json');
  
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`Swagger spec generated at: ${outputPath}`);
  
  await app.close();
  process.exit(0);
}

generate().catch((err) => {
  console.error('Error generating swagger spec:', err);
  process.exit(1);
});
