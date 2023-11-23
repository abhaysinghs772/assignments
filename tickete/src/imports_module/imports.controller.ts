import { Controller, Get, Query, Body, Req, Res } from "@nestjs/common";

@Controller('/api/v1/experience')
export class ImportsController {
    
    @Get('/:id/slots')
    checkSlots(@Query('date') date: string, @Req() req ): string{        
        console.log(date + '\n');
        console.log(req.header('x-forwarded-for') || req.header('x-real-ip') || req.header('X-Forwarded-For'));
        return "hello from slots controller";
    }
}