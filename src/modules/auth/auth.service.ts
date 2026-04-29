import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE, type DrizzleDB } from 'src/core/database/database.provider';
import { LoginDto } from './dtos/login.dto';
import { users } from 'src/core/database/schema';
import { eq } from 'drizzle-orm';
import { User } from '../maintenance/user/types/user.types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { PermissionService } from '../maintenance/access-control/permission/permission.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly permissionService: PermissionService,
  ) { }

  async login(user: User) {
    const payload = { sub: user.id };


    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const hashedRefreshToken = await bcrypt.hash(tokenHash, 10);

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

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    const isRefreshTokenValid = await bcrypt.compare(tokenHash, user.refreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid token');
    }

    const newAccessToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    const newTokenHash = createHash('sha256').update(newRefreshToken).digest('hex');
    const hashed = await bcrypt.hash(newTokenHash, 10);

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

    const [user] = await this.db
      .select({
        userId: users.id,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { refreshToken, password: userPassword, deletedAt, ...safeUserFields } = user;

    const isMatch = await bcrypt.compare(password, userPassword);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const { password: hashedPassword, ...userWithoutPassword } = user;
    const permissions = await this.permissionService.findPermissionForUser(user.userId);

    return { ...userWithoutPassword, permissions };
  }

  async logout(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.db.update(users).set({ refreshToken: null }).where(eq(users.id, payload.sub));
  }
}
