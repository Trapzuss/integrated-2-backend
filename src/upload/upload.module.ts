import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import * as firebase from 'firebase-admin';
import { ConfigModule } from '@nestjs/config';
import { Environment } from 'src/environment/firebase';
import { FirebaseModule } from 'nestjs-firebase';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule.forRoot({
      googleApplicationCredential:
        'src/environment/firebaseServicesAccount.json',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
