import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { dbconfig } from './core/config/db';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './core/common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dataSource = new DataSource(dbconfig.getTypeOrmConfig());
  await dataSource.initialize();

  app.enableCors({ origin: '*', credentials: true });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Fx Trading App API')
    .setDescription('API for currency trading')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));

  await app.listen(process.env.PORT ?? 7000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
