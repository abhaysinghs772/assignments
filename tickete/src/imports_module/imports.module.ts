import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { SlotsLimiterMiddleware, DatesLimiterMiddleware } from "./limiters";
import { ImportsController } from "./imports.controller";

@Module({
    imports: [],
    controllers: [ImportsController],
    providers: [],
    exports: [ImportsModule]
})
export class ImportsModule implements NestModule {
    constructor(){ }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply( SlotsLimiterMiddleware )
            .forRoutes( { path: '/api/v1/experience', method: RequestMethod.GET } )
        
        consumer
            .apply(DatesLimiterMiddleware)
            .forRoutes( { path: '/api/v1/experience', method: RequestMethod.GET } )
    }
}
