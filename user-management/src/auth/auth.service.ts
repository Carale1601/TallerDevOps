import { compareSync } from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';

import { LoginParams } from './params/login.params';
import { USER_REPOSITORY, UserRepository } from '../user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}

  async loginUser(params: LoginParams) {
    const userResult = await this.userRepository.getUserByEmail(
      params.email,
      false,
    );

    if (!userResult) {
      return false;
    }

    const { password, ...userdata } = userResult;

    const validLogin = compareSync(params.password, password);
    if (!validLogin) {
      return false;
    }

    return userdata;
  }
}
