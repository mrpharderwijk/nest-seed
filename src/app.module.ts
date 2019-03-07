import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassportModule } from '@nestjs/passport';
import { databaseProviders } from './shared/database/database.providers';
import { usersProviders } from './users/users.providers';
import { UserService } from './users/user.service';
import { UsersController } from './users/users.controller';
import { DatabaseModule } from './shared/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.load(
      path.resolve(__dirname, 'shared/config/**/!(*.d).{ts,js}'),
    ),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('jwt').secretKey,
        signOptions: {
          expiresIn: Number(configService.get('jwt').expiresIn),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        defaultStrategy: configService.get('jwt').defaultStrategy,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [
    AuthService,
    AppService,
    ...databaseProviders,
    JwtStrategy,
    UserService,
    ...usersProviders,
  ],
  exports: [AuthService, ...databaseProviders, UserService, ...usersProviders],
})
export class AppModule {}
