import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/database/database.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
