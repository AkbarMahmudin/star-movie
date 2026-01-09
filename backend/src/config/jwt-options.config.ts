import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtOptionsConfig implements JwtOptionsFactory {
  constructor(private config: ConfigService) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const algorithm: 'HS256' | 'RS256' | 'ES256' =
      (this.config.get('jwt.algorithm') as 'HS256' | 'RS256' | 'ES256') ||
      'HS256';
    const secret = algorithm === 'HS256' && this.config.get('jwt.secretKey');
    const issuer = this.config.get('app.apiUrl') || 'localhost:3000';
    const audience = this.config.get('app.appUrl') || 'localhost:5173';

    return {
      signOptions: {
        expiresIn: this.config.get('jwt.expiresIn') || '7d',
        algorithm,
        issuer,
        audience,
      },
      verifyOptions: {
        ignoreExpiration: false,
        issuer,
        audience,
        algorithms: [algorithm],
      },
      secret,
    };
  }
}
