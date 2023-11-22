import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly NOTIFICATION_SERVICE: ClientProxy,
  ) {}

  getHello(): string {
    // whenever i want to emit a message just trigger the event like this
    this.NOTIFICATION_SERVICE.emit('my-custom-message', {
      key: 'some random data, >>> this message coming from MAIN-SERVICE ',
    });

    return 'Hello World!';
  }
}
