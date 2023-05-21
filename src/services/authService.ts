import bcrypt from 'bcrypt';
import { Document, ObjectId, WithId } from 'mongodb';
import jwt, { Algorithm, SignOptions } from 'jsonwebtoken';
import { ErrorLog } from '../events/errorHandler.js';
import logHandler from '../events/logHandler.js';
import { authRepository } from '../repositories/authRepository.js';
import { SignInType, User } from '../types/types.js';

async function checkIfUserIsAlreadyRegistered(email: string): Promise<void> {
  const user: User | null = await authRepository.findUserInDatabase_ThroughEmail(email);
  if (user) throw new ErrorLog(409, 'User already exists');
  logHandler('Service', 'This email is available');
}

function encryptPassword(password: string): string {
  if (!process.env.SALT) throw new ErrorLog(500, 'SALT environment variable not found');
  const encryptedPassword: string = bcrypt.hashSync(password, +process.env.SALT);
  logHandler('Service', 'Password encrypted');
  return encryptedPassword;
}

async function checkIfUserIsRegistered(email: string): Promise<SignInType> {
  const user: User | null = await authRepository.findUserInDatabase_ThroughEmail(email);
  if (!user) throw new ErrorLog(404, 'User not found');
  const signInObject: SignInType = { userId: user._id, encryptedPassword: user.password };
  return signInObject;
}

function checkIfPasswordIsValid(password: string, encryptedPassword: string): void {
  const passwordIsValid: boolean = bcrypt.compareSync(password, encryptedPassword);
  if (!passwordIsValid) throw new ErrorLog(401, 'Invalid password');
  logHandler('Service', 'Password decrypted');
}

function generateToken(userId: ObjectId): string {
  const data = {};
  const subject: string = String(userId.id);
  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN || !process.env.JWT_ALGORITHM) {
    throw new ErrorLog(500, 'JWT environment variables not found');
  }
  const secretKey: string = process.env.JWT_SECRET;
  const expiresIn: string = process.env.JWT_EXPIRES_IN;
  const algorithm = process.env.JWT_ALGORITHM as Algorithm;
  const config: SignOptions = { algorithm, expiresIn, subject };
  const token: string = jwt.sign(data, secretKey, config);
  logHandler('Service', 'Token generated');
  return token;
}

export {
  checkIfUserIsAlreadyRegistered,
  encryptPassword,
  checkIfUserIsRegistered,
  checkIfPasswordIsValid,
  generateToken
};
