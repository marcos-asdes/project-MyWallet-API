import * as authService from './authService.js';
import { authRepository } from '../repositories/authRepository.js';
import { ErrorLog } from '../events/errorHandler.js';
import { ObjectId } from 'mongodb';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkIfUserIsAlreadyRegistered', () => {
  it('should throw an error if user already exists', async () => {
    const mockUser = { email: 'user@example.com' };
    authRepository.findUserInDatabase_ThroughEmail = jest.fn().mockResolvedValue(mockUser);

    expect.assertions(2);
    try {
      await authService.checkIfUserIsAlreadyRegistered('user@example.com');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.message).toBe('User already exists');
      }
    }
  });

  it('should not throw an error if user does not exist', async () => {
    authRepository.findUserInDatabase_ThroughEmail = jest.fn().mockResolvedValue(null);

    await expect(
      authService.checkIfUserIsAlreadyRegistered('newuser@example.com')
    ).resolves.toBeUndefined();
    expect(authRepository.findUserInDatabase_ThroughEmail).toHaveBeenCalledWith(
      'newuser@example.com'
    );
  });
});

describe('encryptPassword', () => {
  beforeEach(() => {
    process.env.SALT = '10';
  });

  afterEach(() => {
    delete process.env.SALT;
  });

  it('should encrypt the password', () => {
    const password = 'mypassword';
    const encryptedPassword = authService.encryptPassword(password);

    expect(encryptedPassword).toBeDefined();
    expect(encryptedPassword).not.toBe(password);
  });

  it('should throw an error if SALT environment variable is not found', () => {
    delete process.env.SALT;

    expect.assertions(2);
    try {
      authService.encryptPassword('mypassword');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.message).toBe('SALT environment variable not found');
      }
    }
  });
});

describe('checkIfUserIsRegistered', () => {
  it('should return the sign-in object if user is registered', async () => {
    const email = 'test@example.com';
    const userId = new ObjectId();
    const user = { _id: userId, email: 'test@example.com', password: 'hashedPassword' };
    authRepository.findUserInDatabase_ThroughEmail = jest.fn().mockResolvedValue(user);

    const signInObject = await authService.checkIfUserIsRegistered(email);

    expect(signInObject).toBeDefined();
    expect(signInObject).toEqual({ userId: userId, encryptedPassword: 'hashedPassword' });
    expect(authRepository.findUserInDatabase_ThroughEmail).toHaveBeenCalledWith(email);
  });

  it('should throw an error if user is not found', async () => {
    const email = 'nonexistent@example.com';
    authRepository.findUserInDatabase_ThroughEmail = jest.fn().mockResolvedValue(null);

    expect.assertions(3);
    try {
      await authService.checkIfUserIsRegistered(email);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.message).toBe('User not found');
      }
    }
    expect(authRepository.findUserInDatabase_ThroughEmail).toHaveBeenCalledWith(email);
  });
});
