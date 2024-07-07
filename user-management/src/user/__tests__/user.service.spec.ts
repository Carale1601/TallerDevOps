import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '../user.service';
import { CREATE_USER_PARAMS, USERS_MOCK, USER_MOCK } from './user.mocks';
import { USER_REPOSITORY, UserRepository } from '../user.repository';

import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY,
          useValue: {
            createUser: jest.fn(),
            getAllUsers: jest.fn(),
            getUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(USER_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user', async () => {
    jest.spyOn(repository, 'createUser').mockResolvedValue(USER_MOCK);
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('NEW_HASH');

    const result = await service.createUser(CREATE_USER_PARAMS);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should get all users', async () => {
    jest.spyOn(repository, 'getAllUsers').mockResolvedValue(USERS_MOCK);

    const result = await service.getAllUsers();

    expect(result).toBeDefined();
    expect(result).toEqual(USERS_MOCK);
  });

  it('should get an user with his id', async () => {
    jest.spyOn(repository, 'getUser').mockResolvedValue(USER_MOCK);

    const result = await service.getUser(USER_MOCK.id);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should update an user', async () => {
    jest.spyOn(repository, 'updateUser').mockResolvedValue(USER_MOCK);

    const result = await service.updateUser(USER_MOCK.id, {});

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should update an user with a new password', async () => {
    jest.spyOn(repository, 'updateUser').mockResolvedValue(USER_MOCK);
    jest.spyOn(bcrypt, 'hashSync').mockReturnValue('NEW_HASH');

    const result = await service.updateUser(USER_MOCK.id, {
      password: 'nueva_clave',
    });

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should delete an user', async () => {
    jest.spyOn(repository, 'deleteUser').mockResolvedValue(USER_MOCK);

    const result = await service.removeUser(USER_MOCK.id);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });
});
