import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    if (exception.code && exception.code === 11000) {
      response.status(400).json({
        errorCode: exception.code,
        message: 'User already exists.',
      });
    } else {
      response.status(500).json({
        errorCode: '500',
        message: 'Internal error.',
      });
    }
  }
}
