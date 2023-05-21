import { ObjectId } from 'mongodb';

export type LogTypes =
  | 'Route'
  | 'Middleware'
  | 'Controller'
  | 'Repository'
  | 'Server'
  | 'Service'
  | 'Util'
  | 'Error';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
}

export type UserId = Pick<User, '_id'>;

export type UserWithoutId = Omit<User, '_id'>;

export type SignInType = {
  userId: ObjectId;
  encryptedPassword: string;
};
