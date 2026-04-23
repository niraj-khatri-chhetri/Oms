import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type User } from '../maintenance/user/types/user.types';
import { LocalGuard } from 'src/core/guards/local.guard';
import { JwtRefreshGuard } from 'src/core/guards/jwt-refresh.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@CurrentUser() user: User, @Res() res: Response) {
    const { user: loggedInUser, accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data: { user: loggedInUser },
      message: 'Login successful',
      success: true,
    });
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req, @Res() res: Response) {
    const { userId, refreshToken } = req.user;

    console.log('Refreshing token for userId:', userId);
    console.log('Received refresh token:', refreshToken);

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(
      refreshToken,
      userId,
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      data: {},
      success: true,
    });
  }

  @Public()
  @Post('logout')
  async logout(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken).then(() => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
      });
    } else {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }

    res.json({
      data: {},
      message: 'Logout successful',
      success: true,
    });
  }
}
