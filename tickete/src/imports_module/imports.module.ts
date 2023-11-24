import { Module } from "@nestjs/common";
import { ImportsController } from "./imports.controller";

@Module({
    imports: [],
    controllers: [ImportsController],
    providers: [],
    exports: []
})
export class ImportsModule { }
