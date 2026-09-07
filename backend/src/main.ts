import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the ConfigService from the application context
  const configService = app.get(ConfigService);

  // Make versioned API prefix configurable via environment variable
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Get the port from the environment variable or use a default value
  const port = configService.get<number>('Port', 4000);

  // Swagger Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Next, Nest and Postgresql Learning API')
    .setDescription('Learning project API')
    .setVersion('1.0')
    .build();
  // Create Swagger document and setup Swagger module
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // Setup Swagger UI at the specified endpoint
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(port);

  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
