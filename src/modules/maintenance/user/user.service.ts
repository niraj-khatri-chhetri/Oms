import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UserResponseDto } from './dtos/user.dto';
import { NewUser } from './types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) { }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const data = await this.userRepo.findAllUsers();
    return plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userRepo.findUserByEmail(userData.email);

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const payload = { ...userData, password: hashedPassword };

    const data = await this.userRepo.createUser(payload);
    return plainToInstance(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
