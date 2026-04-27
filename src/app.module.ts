import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/maintenance/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/maintenance/department/department.module';
import { AccessControlModule } from './modules/maintenance/access-control/access-control.module';
import { APP_FILTER } from '@nestjs/core';
// import { CatchEverythingFilter } from './common/Exception/catch-everything.filter';

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
  ],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: CatchEverythingFilter
    // }
  ],
})
export class AppModule { }
