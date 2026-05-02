import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { ApiCreateEndpoint } from 'src/common/decorators/api-endpoint.decorator';
import { CreateDesignationDto } from './dtos/designation.dtos';
import { RoleResponseDto } from '../access-control/role/dtos/role.dtos';

@Controller('designations')
export class DesignationController {

     constructor(private readonly designationService: DesignationService) { }

     @ApiCreateEndpoint({
          summary: 'Create a new role with associated permissions',
          //Change the response type to DesignationResponseDto later when it is created
          responseType: CreateDesignationDto,
     })
     @Post()
     async createDesignation(@Body() newDesignation: CreateDesignationDto) {
          const data = await this.designationService.createDesignation(newDesignation)

          return {
               data,
               message: 'Designation created successfully',
          }
     }

     @Get()
     async findAllDesignations() {
          const data = await this.designationService.findAllDesignations();
          return data;
     }

     @Get('/:id/users')
     async findUsersByDesignationId(@Param('id') designationId: string) {
          const data = await this.designationService.findUsersByDesignationId(designationId);
          return data;
     }



}
