import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ConfigService } from 'src/config/config.service';

export const getTypeOrmModuleOptions = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'sqlite',
  database: config.getDatabasePath(),
  autoLoadEntities: true,
  synchronize: false,
});
