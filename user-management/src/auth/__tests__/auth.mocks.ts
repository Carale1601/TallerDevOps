import { User } from '../../user/user.model';
import { LoginParams } from '../params';

export const VALID_LOGIN_DATA: LoginParams = {
  email: 'asd@asd.com',
  password: 'clave',
};

export const VALID_USER: User = {
  id: 1,
  email: 'asd@asd.com',
  name: 'asd',
  password: '$2a$10$hihKheb.MmZcrQ9n22f.Q.buf60ei.QJPgdPXm36K1FEK4CRcSChy', // clave
};
