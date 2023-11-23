import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SlotsLimiterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) { 

    // just for testing purpose
    console.log(req.header('x-forwarded-for') || req.header('x-real-ip') || req.header('X-Forwarded-For'));
    next();
  }
}
