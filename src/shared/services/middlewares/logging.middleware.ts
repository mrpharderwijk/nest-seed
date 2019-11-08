import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  // resolve(name: string): MiddlewareFunction {
  //   return (req, res, next) => {
  //     // console.log(`[${name}] Request...`); // [ApplicationModule] Request...
  //     next();
  //   };
  // }

  use(req: Request, res: Response, next: FunctionConstructor) {
    console.log('Request...');
    next();
  }
}
