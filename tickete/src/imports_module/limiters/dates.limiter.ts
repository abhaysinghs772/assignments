import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DatesLimiterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) { 
    console.log(req.ip);
    next();
  }
}
