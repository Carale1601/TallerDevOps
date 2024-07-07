import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Provider } from '@nestjs/common';

import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

import { getTypeOrmModuleOptions } from './typeorm.config';

import * as ENTITIES from './entities';
import { UserRepositoryImp } from './repositories';
import { USER_REPOSITORY } from 'src/user/user.repository';

const REPOSITORIES: Provider[] = [
  { provide: USER_REPOSITORY, useClass: UserRepositoryImp },
];

@Module({
  imports: [
    /* Configuración TypeORM */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
    TypeOrmModule.forFeature(Object.values(ENTITIES)),
  ],
  providers: [...REPOSITORIES],
  exports: [...REPOSITORIES],
})
export class DatabaseModule {}
