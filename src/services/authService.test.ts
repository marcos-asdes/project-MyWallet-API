import { faker } from '@faker-js/faker';

import * as authService from './authService.js';
import { authRepository } from '../repositories/authRepository.js';
import { ErrorLog } from '../events/errorHandler.js';

describe('checkIfUserIsAlreadyRegistered', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* it('should throw an error if user already exists', async () => {
    const email = faker.internet.email();
    const mockUser = { email: email };
    authRepository.findUserInDatabase_ThroughEmail = jest.fn().mockResolvedValue(mockUser);
    await expect(async () => {
      await authService.checkIfUserIsAlreadyRegistered(email);
    }).rejects.toThrow(ErrorLog);
    expect(authRepository.findUserInDatabase_ThroughEmail).toHaveBeenCalledWith(email);
  }); */

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
