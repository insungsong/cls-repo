import { NestConfigService } from '@libs/common/config/nest-config.service';
import { Payload } from '@libs/common/interface/jwt.paylod.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: NestConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: Payload) {
    if (payload.iss != 'nest-server.com') return undefined;

    return { email: payload.aud, scopes: payload.scopes };
  }
}
