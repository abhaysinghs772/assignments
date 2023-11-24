import { Controller, Get, Query, Body, Req, Res } from "@nestjs/common";

@Controller('/api/v1/experience')
export class ImportsController {
    
    @Get('/:id/slots')
    checkSlots(@Query('date') date: string, @Req() req ): string{        
        return "hello from slots controller";
    }
}