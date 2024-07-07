import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { VALID_LOGIN_DATA, VALID_USER } from './auth.mocks';
import { USER_REPOSITORY, UserRepository } from '../../user/user.repository';

describe('#AuthService', () => {
  let service: AuthService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<UserRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loginUser', () => {
    it('should login user with given parameters', async () => {
      const { password, ...userData } = VALID_USER;

      const loginSpy = jest
        .spyOn(repository, 'getUserByEmail')
        .mockResolvedValue(VALID_USER);

      const result = await service.loginUser(VALID_LOGIN_DATA);

      expect(result).toBeDefined();
      expect(result).toEqual(userData);
      expect(loginSpy).toHaveBeenCalled();
    });

    it('should not login user with wrong password', async () => {
      const loginSpy = jest
        .spyOn(repository, 'getUserByEmail')
        .mockResolvedValue(VALID_USER);

      const result = await service.loginUser({
        ...VALID_LOGIN_DATA,
        password: 'clavemala',
      });

      expect(result).toBeDefined();
      expect(result).toEqual(false);
      expect(loginSpy).toHaveBeenCalled();
    });

    it('should not login user with wrong email', async () => {
      const loginSpy = jest
        .spyOn(repository, 'getUserByEmail')
        .mockResolvedValue(null);

      const result = await service.loginUser({
        ...VALID_LOGIN_DATA,
        email: 'notfound@asd.com',
      });

      expect(result).toBeDefined();
      expect(result).toEqual(false);
      expect(loginSpy).toHaveBeenCalled();
    });
  });
});
