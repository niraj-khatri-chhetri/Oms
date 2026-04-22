import { Controller, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { type User } from '../maintenance/user/types/user.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(@CurrentUser() user: User, @Res() res: Response) {
    console.log('User authenticated from controller:', user);

    const { user: loggedInUser, accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({
      data: { user: loggedInUser, accessToken, refreshToken },
      success: true,
    });
  }
}
