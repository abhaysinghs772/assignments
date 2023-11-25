import { Controller, Get, Query, Body, Req, Res, Param } from "@nestjs/common";
import { ImportsService } from "./imports.service";
import { SlotResponse } from "./interfaces/slotResponse.dto";

@Controller('/api/v1/experience')
export class ImportsController {
    constructor(
        private readonly importService: ImportsService,
    ){}

    @Get('/:id/slots')
    getSlots(@Query('date') date: string, @Param('id') id): Promise<SlotResponse[]>{
        return this.importService.fetchAllSlotsBy_Id_And_Date(id, date);
    }
}