import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { VALID_LOGIN_DATA, VALID_USER } from './auth.mocks';
import { HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        {
          provide: AuthService,
          useValue: {
            loginUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('loginUser', () => {
    it('should login with given parameters', async () => {
      const { password, ...userData } = VALID_USER;

      const loginSpy = jest
        .spyOn(service, 'loginUser')
        .mockResolvedValue(userData);

      const result = await controller.loginUser(VALID_LOGIN_DATA);

      expect(result).toBeDefined();
      expect(result).toEqual(userData);
      expect(loginSpy).toHaveBeenCalled();
    });

    it('should not login with wrong parameters', async () => {
      const loginSpy = jest.spyOn(service, 'loginUser').mockResolvedValue(null);

      try {
        await controller.loginUser(VALID_LOGIN_DATA);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(HttpException);
        expect(loginSpy).toHaveBeenCalled();
        return;
      }

      throw Error();
    });
  });
});
