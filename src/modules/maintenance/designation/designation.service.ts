import { Injectable } from '@nestjs/common';
import { NewDesignation } from './types/designation.types';
import { DesignationRepository } from './designation.repository';

@Injectable()
export class DesignationService {
     constructor(private readonly designationRepo: DesignationRepository) { }

     async createDesignation(newDesignation: NewDesignation): Promise<any> {
          const data = await this.designationRepo.createDesignation(newDesignation);
          return data;
     }
}
