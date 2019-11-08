import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from 'nestjs-config';
import { LoggingInterceptor } from './shared/services/interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/services/interceptors/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix(`v${configService.get('api').version}`);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    // new ErrorsInterceptor(),
  );

  await app.listen(configService.get('express').port || 3000);
}
bootstrap();
