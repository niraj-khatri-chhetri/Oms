import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findAllUsers(): Promise<any[]> {
    const data = await this.userRepo.findAllUsers();
    return data;
  }

  async createUser(userData: any): Promise<any> {
    const data = await this.userRepo.createUser(userData);
    return data;
  }
}
