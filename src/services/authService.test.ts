import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

    expect.assertions(3);
    try {
      await authService.checkIfUserIsAlreadyRegistered('user@example.com');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.statusCode).toBe(409);
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

    expect.assertions(3);
    try {
      authService.encryptPassword('mypassword');
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.statusCode).toBe(500);
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

    expect.assertions(4);
    try {
      await authService.checkIfUserIsRegistered(email);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('User not found');
      }
    }
    expect(authRepository.findUserInDatabase_ThroughEmail).toHaveBeenCalledWith(email);
  });
});

describe('checkIfPasswordIsValid', () => {
  it('should not throw an error if password is valid', () => {
    const password = 'mypassword';
    const encryptedPassword = bcrypt.hashSync(password, 10);

    expect(() => {
      authService.checkIfPasswordIsValid(password, encryptedPassword);
    }).not.toThrow();
  });

  it('should throw an error if password is invalid', () => {
    const password = 'mypassword';
    const encryptedPassword = bcrypt.hashSync('differentpassword', 10);

    expect.assertions(3);
    try {
      authService.checkIfPasswordIsValid(password, encryptedPassword);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe('Invalid password');
      }
    }
  });
});

describe('generateToken', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRES_IN = '1h';
    process.env.JWT_ALGORITHM = 'HS256';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate a token if all JWT environment variables are provided', () => {
    const userId: any = { toHexString: jest.fn().mockReturnValue('123') };
    const expectedToken = 'generatedToken';

    jwt.sign = jest.fn().mockReturnValue(expectedToken);
    const token = authService.generateToken(userId);

    expect(token).toBe(expectedToken);
    expect(jwt.sign).toHaveBeenCalledWith({}, 'secret', {
      algorithm: 'HS256',
      expiresIn: '1h',
      subject: '123'
    });
  });

  it('should throw an error if any JWT environment variable is missing', () => {
    process.env.JWT_SECRET = '';
    const userId: any = { toHexString: jest.fn().mockReturnValue('123') };

    expect.assertions(3);
    try {
      authService.generateToken(userId);
    } catch (error) {
      expect(error).toBeInstanceOf(ErrorLog);
      if (error instanceof ErrorLog) {
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe('JWT environment variables not found');
      }
    }
  });
});
