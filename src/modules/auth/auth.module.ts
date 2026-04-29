import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AccessControlModule } from '../maintenance/access-control/access-control.module';

@Module({
  imports: [JwtModule.register({}), AccessControlModule],
  providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
