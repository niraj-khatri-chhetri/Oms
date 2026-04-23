import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { LoginDto } from './dtos/login.dto';
import { users } from 'src/core/database/schema';
import { eq } from 'drizzle-orm';
import { User } from '../maintenance/user/types/user.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: User) {
    const payload = { sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '1m',
    });

    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.db
      .update(users)
      .set({
        refreshToken: hashedRefreshToken,
      })
      .where(eq(users.id, user.id));

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string, userId: string) {
    let payload: any;

    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    if (payload.sub !== userId) {
      throw new UnauthorizedException('Invalid token');
    }

    const [user] = await this.db.select().from(users).where(eq(users.id, userId));

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '1m',
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    const hashed = await bcrypt.hash(newRefreshToken, 10);

    await this.db
      .update(users)
      .set({
        refreshToken: hashed,
      })
      .where(eq(users.id, user.id));

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const [user] = await this.db.select().from(users).where(eq(users.email, email));

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.db.update(users).set({ refreshToken: null }).where(eq(users.id, payload.sub));
  }
}
