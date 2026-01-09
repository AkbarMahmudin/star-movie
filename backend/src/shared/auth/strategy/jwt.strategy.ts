import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    const algorithms = config.get('jwt.algorithm');
    const secretOrKey =
      algorithms === 'HS256'
        ? config.get('jwt.secretKey')
        : readFileSync(config.get('jwt.keyFolder') + config.get('secretKey'));

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
      algorithms,
      issuer: config.get('app.api_url'),
      audience: config.get('app.app_url'),
    });
  }

  async validate(args: any) {
    return args;
  }
}
