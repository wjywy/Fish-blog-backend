// src/modules/user/jwt.strategy.ts

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '630wujiayuwy',
    });
  }

  async validate(payload: any) {
    return {
      //   id: payload.id,
      //   mobile: payload.mobile,
      password: payload.password,
    };
  }
}
