import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从请求头取令牌
      ignoreExpiration: false, // 令牌过期就拒绝
      secretOrKey: process.env.JWT_SECRET || 'backend_secret',
    });
  }

  async validate(payload: { sub: number; email: string; role: Role }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new UnauthorizedException('用户不存在');
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
