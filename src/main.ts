import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
  .setTitle('Diets')
  .setDescription('The Diets Api description')
  .setVersion('1.0')
  .addTag('diets')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(3000);
}
bootstrap();
