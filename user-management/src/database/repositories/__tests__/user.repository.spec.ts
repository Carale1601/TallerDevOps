import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserEntity } from '../../entities';

import { UserRepositoryImp } from '../user.repository';
import { USERS_MOCK, USER_MOCK } from './user.repository.mocks';
import { User } from 'src/user/user.model';

describe('UserRepository', () => {
  let repository: UserRepositoryImp;
  let dbRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepositoryImp,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepositoryImp>(UserRepositoryImp);
    dbRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(dbRepository).toBeDefined();
  });

  it('should get a user with a valid id', async () => {
    jest.spyOn(dbRepository, 'findOne').mockImplementation(async (options) => {
      expect(options).toBeDefined();
      expect(options).toHaveProperty('where');
      expect(options.where).toHaveProperty('id', USER_MOCK.id);
      return USER_MOCK;
    });

    const result = await repository.getUser(USER_MOCK.id);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should get a user with a valid email', async () => {
    jest.spyOn(dbRepository, 'findOne').mockImplementation(async (options) => {
      expect(options).toBeDefined();
      expect(options).toHaveProperty('where');
      expect(options.where).toHaveProperty('email', USER_MOCK.email);
      return USER_MOCK;
    });

    const result = await repository.getUserByEmail(USER_MOCK.email);

    expect(result).toBeDefined();
    expect(result).toEqual(USER_MOCK);
  });

  it('should get a list of users', async () => {
    jest.spyOn(dbRepository, 'find').mockResolvedValue(USERS_MOCK);

    const result = await repository.getAllUsers();

    expect(result).toBeDefined();
    expect(result).toEqual(USERS_MOCK);
  });

  it('should create an user', async () => {
    const { id, ...createUserParams } = USER_MOCK;
    const { password, ...returnedUser } = USER_MOCK;

    jest.spyOn(dbRepository, 'save').mockImplementation(async (params) => {
      expect(params).toBeDefined();

      expect(params).toHaveProperty('name', createUserParams.name);
      expect(params).toHaveProperty('email', createUserParams.email);
      expect(params).toHaveProperty('password', createUserParams.password);

      return USER_MOCK;
    });
    jest.spyOn(dbRepository, 'findOne').mockImplementation(async (options) => {
      expect(options).toBeDefined();
      expect(options).toHaveProperty('where');
      expect(options.where).toHaveProperty('id', USER_MOCK.id);
      return returnedUser as User;
    });

    const result = await repository.createUser(createUserParams);

    expect(result).toBeDefined();
    expect(result).toEqual(returnedUser);
  });

  it('should update an user', async () => {
    const { password, ...returnedUser } = USER_MOCK;

    jest.spyOn(dbRepository, 'findOne').mockImplementation(async (options) => {
      expect(options).toBeDefined();
      expect(options).toHaveProperty('where');
      expect(options.where).toHaveProperty('id', USER_MOCK.id);
      return returnedUser as User;
    });
    const updateSpy = jest
      .spyOn(dbRepository, 'update')
      .mockResolvedValue({ generatedMaps: [], raw: {} });

    const result = await repository.updateUser(USER_MOCK.id, {});

    expect(result).toBeDefined();
    expect(result).toEqual(returnedUser);
    expect(updateSpy).toHaveBeenCalledWith(USER_MOCK.id, {});
  });

  it('should delete an user', async () => {
    const { password, ...returnedUser } = USER_MOCK;

    jest.spyOn(dbRepository, 'findOne').mockImplementation(async (options) => {
      expect(options).toBeDefined();
      expect(options).toHaveProperty('where');
      expect(options.where).toHaveProperty('id', USER_MOCK.id);
      return returnedUser as User;
    });
    const deleteSpy = jest
      .spyOn(dbRepository, 'delete')
      .mockResolvedValue({ raw: {} });

    const result = await repository.deleteUser(USER_MOCK.id);

    expect(result).toBeDefined();
    expect(result).toEqual(returnedUser);
    expect(deleteSpy).toHaveBeenCalledWith(USER_MOCK.id);
  });
});
