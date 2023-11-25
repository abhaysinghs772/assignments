import { Module } from "@nestjs/common";
import { ImportsController } from "./imports.controller";
import { ImportsService } from './imports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot, PaxAvailability } from "./entities";

@Module({
    imports: [ TypeOrmModule.forFeature( [ Slot, PaxAvailability ] ) ],
    controllers: [ ImportsController ],
    providers: [ ImportsService ],
    exports: []
})
export class ImportsModule { }
