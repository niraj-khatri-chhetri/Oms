import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/maintenance/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/maintenance/department/department.module';
import { AccessControlModule } from './modules/maintenance/access-control/access-control.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE, RouterModule } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { JwtAccessGuard } from './core/guards/jwt-access.guard';
import { PermissionsGuard } from './core/guards/permissions.guard';
import { DesignationModule } from './modules/maintenance/designation/designation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    DepartmentModule,
    AccessControlModule,
    RouterModule.register([
      {
        path: 'access-control',
        module: AccessControlModule,
      },
    ]),
    DesignationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
