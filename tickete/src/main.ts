import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(express));

  app.enableCors();
  app.use(bodyParser.json({ limit: '1024mb' }));
  app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }));
  app.use(logger('dev'));

  await app.listen(3000, () => {
    console.log('api is listening on port 3000');
  });
}
bootstrap();
