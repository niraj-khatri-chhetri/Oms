import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateUserDto, UserResponseDto } from './dtos/user.dto';
import { ApiCreateEndpoint, ApiGetEndpoint } from 'src/common/decorators/api-endpoint.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiGetEndpoint({
    summary: 'Get all users',
    responseType: UserResponseDto,
    isArray: true,
  })
  @Get()
  async findAllUsers() {
    const data = await this.userService.findAllUsers();
    return data;
  }

  @Public()
  @ApiCreateEndpoint({
    summary: 'Create a new user',
    responseType: UserResponseDto,
  })
  @Post()
  async createUser(@Body() userData: CreateUserDto) {
    const data = await this.userService.createUser(userData);

    return {
      data,
      message: 'User created successfully',
      success: true,
    };
  }
}
