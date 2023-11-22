import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  @EventPattern('my-custom-message')
  getHello(@Payload() payload: any): string {
    console.log('Inside operation servie >>>>\n', payload);
    return this.appService.getHello();
  }
}
