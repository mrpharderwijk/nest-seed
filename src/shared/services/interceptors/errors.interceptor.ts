import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
  CallHandler,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Response } from './transform.interceptor';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    return next.handle().pipe(
      catchError(err => {
        return throwError(new HttpException('Message', HttpStatus.BAD_GATEWAY));
      }),
    );
  }
}
