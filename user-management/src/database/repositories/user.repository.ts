import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { User } from 'src/user/user.model';
import { UserRepository } from 'src/user/user.repository';

import { CreateUserParams, UpdateUserParams } from 'src/user/params';

import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepositoryImp implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async getUser(id: number, omitPassword: boolean = true): Promise<User> {
    return this.repository.findOne({
      select: { id: true, email: true, name: true, password: !omitPassword },
      where: { id },
    });
  }

  async getUserByEmail(
    email: string,
    omitPassword: boolean = true,
  ): Promise<User> {
    return this.repository.findOne({
      select: { id: true, email: true, name: true, password: !omitPassword },
      where: { email },
    });
  }

  async getAllUsers(omitPassword: boolean = true): Promise<User[]> {
    return this.repository.find({
      select: { id: true, email: true, name: true, password: !omitPassword },
    });
  }

  async createUser(params: CreateUserParams): Promise<User> {
    const user = await this.repository.save(params);
    return this.getUser(user.id);
  }

  async updateUser(id: number, params: UpdateUserParams): Promise<User> {
    await this.repository.update(id, params);
    return this.getUser(id);
  }

  async deleteUser(id: number): Promise<User> {
    const user = this.getUser(id);
    await this.repository.delete(id);
    return user;
  }
}
