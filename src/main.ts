/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  //Config to serve static images
  app.use(
    '/uploads/profile-pictures',
    express.static(join(__dirname, '..', 'uploads', 'profile_pictures')),
  );
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads')),
  );

  const PORT = process.env.PORT ?? 3000;
  console.log(`Server running on port ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
