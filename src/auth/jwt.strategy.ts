import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from 'nestjs-config';
import { AuthJwtReply } from '../shared/models/auth/auth-jwt-reply.model';
import { AuthJwtPayload } from '../shared/models/auth/auth-jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt').secretKey,
    });
  }

  async validate(payload: AuthJwtPayload): Promise<AuthJwtReply> {
    const user = await this.authService.validateUser(payload.emailAddress);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      _id: user._id,
      name: {
        firstName: user.name.firstName,
        middleName: user.name.middleName || null,
        lastName: user.name.lastName,
      },
      emailAddress: user.emailAddress,
    };
  }
}
