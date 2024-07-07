import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY, UserRepository } from './user.repository';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  createUser(body: CreateUserDto) {
    body.password = hashSync(body.password, 10);
    return this.userRepository.createUser(body);
  }

  getAllUsers() {
    return this.userRepository.getAllUsers();
  }

  getUser(id: number) {
    return this.userRepository.getUser(id);
  }

  updateUser(id: number, body: UpdateUserDto) {
    if (body.password) {
      body.password = hashSync(body.password, 10);
    }
    return this.userRepository.updateUser(id, body);
  }

  removeUser(id: number) {
    return this.userRepository.deleteUser(id);
  }
}
