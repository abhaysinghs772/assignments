import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Transport, TcpOptions, MqttOptions } from '@nestjs/microservices';

import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(express));

  app.enableCors();
  app.use(bodyParser.json({ limit: '1024mb' }));
  app.use(bodyParser.urlencoded({ limit: '1024mb', extended: true }));
  app.use(logger('dev'));
  
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    session({
      secret: 'some-super-strong-secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to true in a production environment with HTTPS
    }),
  );

  const microserviceOptions: TcpOptions | MqttOptions = {};

  Object.assign(microserviceOptions, {
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });

  // Create a microservice
  app.connectMicroservice(microserviceOptions);

  // Start the microservice
  await app.startAllMicroservices();

  await app.init();
  await app.listen(5000, () => {
    console.log('main_service is listening on port 5000');
  });
}
bootstrap();
