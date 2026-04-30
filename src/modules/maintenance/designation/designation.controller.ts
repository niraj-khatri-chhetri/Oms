import { Body, Controller, Post } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { ApiCreateEndpoint } from 'src/common/decorators/api-endpoint.decorator';
import { CreateDesignationDto } from './dtos/designation.dtos';

@Controller('designation')
export class DesignationController {

     constructor(private readonly designationService: DesignationService) { }

     @ApiCreateEndpoint({
          summary: 'Create a new role with associated permissions',
          //Change the response type to DesignationResponseDto later when it is created
          responseType: CreateDesignationDto,
     })
     @Post()
     async createDesignation(@Body() newDesignation: CreateDesignationDto): Promise<any> {
          console.log("🚀 ~ DesignationController ~ createDesignation ~ newDesignation:", newDesignation)
          const data = await this.designationService.createDesignation(newDesignation)

          return {
               data,
               message: 'Designation created successfully',
          }
     }
}
