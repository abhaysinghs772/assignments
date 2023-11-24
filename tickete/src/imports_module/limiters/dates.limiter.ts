import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class DatesLimiterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) { 
    const RATE_LIMITER = new RateLimiterMemory({
      points: 30, // 30 requests
      duration: 60, // per "60 seconds/1 minute" by IP,
      
      // ideally we should block the request for an hour or may be more depending on the requirement
      blockDuration: 60, // blocking and ip only for 60 seconds
    });

    const IP = req.header('x-forwarded-for') || req.header('x-real-ip') || req.header('X-Forwarded-For') || req.connection.remoteAddress;
    
    RATE_LIMITER
    .consume(IP)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(400).send({
        message:
          'You have exceeded the number of attemps to login. Please, try again in an hour.',
      });
    });
  }
}
