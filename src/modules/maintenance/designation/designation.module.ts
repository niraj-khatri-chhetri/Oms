import { Module } from '@nestjs/common';
import { DesignationController } from './designation.controller';
import { DesignationService } from './designation.service';
import { DesignationRepository } from './designation.repository';

@Module({
  controllers: [DesignationController],
  providers: [DesignationService, DesignationRepository],
  exports: [DesignationService]
})
export class DesignationModule { }
