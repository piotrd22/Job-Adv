import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Tokens, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<Tokens> {
    try {
      const hashedPassw = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassw,
        },
      });

      const tokens = await this.signTokens(user.id, user.email);
      await this.setRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email is already taken!');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new ForbiddenException('Login Failed');

    const compare = await argon.verify(user.password, dto.password);

    if (!compare) throw new ForbiddenException('Login Failed');

    const tokens = await this.signTokens(user.id, user.email);
    await this.setRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        refreshT: {
          not: null,
        },
      },
      data: {
        refreshT: null,
      },
    });
    return true;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || !user.refreshT) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.refreshT, rt);

    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.signTokens(user.id, user.email);
    await this.setRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async setRefreshToken(userId: number, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshT: hash,
      },
    });
  }

  async signTokens(userId: number, email: string): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [token, refreshT] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: token,
      refresh_token: refreshT,
    };
  }
}
