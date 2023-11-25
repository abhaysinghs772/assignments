import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportsModule } from './imports_module/imports.module';
import { SlotsLimiterMiddleware, DatesLimiterMiddleware } from './imports_module/limiters';
import { ScheduleModule } from '@nestjs/schedule';
import { Slot, PaxAvailability } from './imports_module/entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Slot, PaxAvailability],
      synchronize: false, 
      logging: false,
      // thank you God finnally it worked, the line below saved me
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ImportsModule,
    ScheduleModule.forRoot() // for cron jobs
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply( SlotsLimiterMiddleware )
        .forRoutes( { path: '/api/v1/experience/:id/slots', method: RequestMethod.GET } )
    
    consumer
        .apply(DatesLimiterMiddleware)
        .forRoutes( { path: '/api/v1/experience/:id/dates', method: RequestMethod.GET } )
  }
}
