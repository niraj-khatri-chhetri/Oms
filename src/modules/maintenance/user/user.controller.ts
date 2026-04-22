import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAllUsers() {
    const data = await this.userService.findAllUsers();
    return {
      data,
      message: 'Users retrieved successfully',
      success: true,
    };
  }

  @Post()
  async createUser(@Body() userData: any) {
    const data = await this.userService.createUser(userData);

    return {
      data,
      message: 'User created successfully',
      success: true,
    };
  }
}
