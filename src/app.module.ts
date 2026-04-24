import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/maintenance/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/maintenance/department/department.module';
import { AccessControlModule } from './modules/maintenance/access-control/access-control.module';

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
  providers: [AppService],
})
export class AppModule {}
