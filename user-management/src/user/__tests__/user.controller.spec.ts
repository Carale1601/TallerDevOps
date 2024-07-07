import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { USERS_MOCK, USER_MOCK } from './user.mocks';
import { User } from '../user.model';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserController,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUser: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an user', async () => {
    const { id, ...params } = USER_MOCK;

    jest.spyOn(service, 'createUser').mockResolvedValue(USER_MOCK);

    const result = await controller.create(params);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should get all users', async () => {
    jest.spyOn(service, 'getAllUsers').mockResolvedValue(USERS_MOCK);

    const result = await controller.getMany();

    expect(result).toBeDefined();
    expect(result).toEqual(USERS_MOCK);
  });

  it('should get an user with his id', async () => {
    jest.spyOn(service, 'getUser').mockResolvedValue(USER_MOCK);

    const result = await controller.getOne(USER_MOCK.id);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should update an user', async () => {
    jest.spyOn(service, 'updateUser').mockResolvedValue(USER_MOCK);

    const result = await controller.update(USER_MOCK.id, {});

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should delete an user', async () => {
    jest.spyOn(service, 'removeUser').mockResolvedValue(USER_MOCK);

    const result = await controller.remove(USER_MOCK.id);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });
});
