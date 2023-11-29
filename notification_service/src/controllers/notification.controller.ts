import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from '@nestjs/microservices';
import { notificationService } from "src/services";

@Controller()
export class NotificationController {
    constructor( 
        private readonly notificationService: notificationService
    ){}

    @EventPattern('send-email')
    async sendEmail(@Payload() payload: any): Promise<void>{
        return this.notificationService.sendEmail(payload)
    }
}