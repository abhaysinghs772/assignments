import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  AdminController,
  AuthController,
  GroupsController,
  TransectionController,
} from './controllers';
import { AppService } from './app.service';
import {
  AdminService,
  AuthService,
  PermissionService,
  GroupService,
  TransectionService,
} from './services';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { MulterModule } from '@nestjs/platform-express';
import { storage, fileFilter } from '../multer.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
      logging: false,
      // the line below (ssl config )is most important for aws-Rds
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    MulterModule.register({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB limit
      },
    }),
  ],
  controllers: [
    AppController,
    AdminController,
    AuthController,
    GroupsController,
    TransectionController,
  ],
  providers: [
    AppService,
    AdminService,
    AuthService,
    PermissionService,
    GroupService,
    TransectionService
  ],
})
export class AppModule {}
