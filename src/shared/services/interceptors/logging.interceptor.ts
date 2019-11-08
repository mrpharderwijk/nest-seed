import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as log from 'fancy-log';
import * as util from 'util'; // has no default export
import { Response } from './transform.interceptor';

// TODO: <Response<any>> -> <Response<T>>
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    const now = Date.now();
    log(
      `[${util.inspect(new Date())}] - REQUEST`,
      '\r\n',
      `method: ${request.method}`,
      '\n',
      `url: ${request.protocol}://${request.hostname}${request.path}`,
      '\n',
      `headers: ${util.inspect(request.headers)}`,
    );
    return next.handle().pipe(
      tap(data => {
        log(
          `${new Date()} - ${Date.now() - now}ms - RESPONSE: ${
            response.statusCode
          }`,
          '\n',
          `-------------------- END`,
          '\n',
        );
        return data;
      }),
    );
  }
}
