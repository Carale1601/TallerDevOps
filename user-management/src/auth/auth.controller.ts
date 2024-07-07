import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { LoginDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() body: LoginDto) {
    const user = await this.authService.loginUser(body);

    if (!user) {
      throw new HttpException('Invalid Credentials.', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
