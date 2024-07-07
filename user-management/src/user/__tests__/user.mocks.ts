import { CreateUserParams } from '../params';
import { User } from '../user.model';

export const USERS_MOCK: User[] = [
  {
    id: 1,
    email: 'asdfgh@test.com',
    name: 'asdfgh',
  } as User,
  {
    id: 2,
    email: 'qwerty@test.com',
    name: 'qwerty',
  } as User,
];

export const USER_MOCK: User = USERS_MOCK[0];

export const CREATE_USER_PARAMS: CreateUserParams = {
  email: 'asdfgh@test.com',
  name: 'asdfgh',
  password: 'una clave cualquiera',
};
