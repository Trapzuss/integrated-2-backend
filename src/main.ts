import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { Environment } from './environment/firebase';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const sessionSecret = configService.get('SESSION_SECRET');
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
    ],
    origin: true,
  });

  // app.use(
  //   session({
  //     secret: sessionSecret,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: { maxAge: 3600000 },
  //   }),
  // );
  // app.use(cookieParser());
  // app.use(passport.session());
  // app.use(passport.initialize());

  // firebase.initializeApp({
  //   credential: firebase.credential.cert({
  //     projectId: configService.get('FIREBASE_PROJECT_ID'),
  //     clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
  //     privateKey: configService.get('FIREBASE_PRIVATE_KEY'),
  //   }),
  //   storageBucket: configService.get('FIREBASE_STORAGE_BUCKET'),
  // });

  await app.listen(port);
}
bootstrap();
