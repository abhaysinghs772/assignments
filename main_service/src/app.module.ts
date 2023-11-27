import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminController } from './controllers/admin.controller';
import { AppService } from './app.service';
import { AdminService, PermissionService } from './services';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';

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
      logging: true,
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
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, AdminService, PermissionService],
})
export class AppModule {}
