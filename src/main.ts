// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { config } from 'dotenv';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// async function bootstrap() {
//   config();
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({origin: true});
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { config } from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const server = express();
  server.use('/public/uploads', express.static('public/uploads'));
  config();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors({ origin: true });
  app.use(cors());

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('App documentation')
    .setDescription('This is the documentation of the app APIs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
