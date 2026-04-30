import { Body, Controller, Post } from '@nestjs/common';

@Controller('designation')
export class DesignationController {

     @Post()
     async createDepartment(@Body() departmentBody: any) {

     }
}
