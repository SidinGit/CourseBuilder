import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;    // User ID
  email: string;  // User email
  iat?: number;   // Issued at (auto-added by JWT)
  exp?: number;   // Expiration (auto-added by JWT)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || '',
        });
    }

    async validate(payload: JwtPayload) {
        // This runs AFTER the token is verified
        // Return whatever you want attached to request.user
        return { userId: payload.sub, email: payload.email };
    }
}