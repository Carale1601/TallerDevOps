import { User } from 'src/user/user.model';

export const USERS_MOCK: User[] = [
  {
    id: 1,
    email: 'asdfgh@test.com',
    name: 'asdfgh',
    password: '$2a$10$hihKheb.MmZcrQ9n22f.Q.buf60ei.QJPgdPXm36K1FEK4CRcSChy',
  },
  {
    id: 2,
    email: 'qwerty@test.com',
    name: 'qwerty',
    password: '$2a$10$hihKheb.MmZcrQ9n22f.Q.buf60ei.QJPgdPXm36K1FEK4CRcSChy',
  },
];

export const USER_MOCK: User = USERS_MOCK[0];
