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

export type SignInType = {
  userId: ObjectId;
  encryptedPassword: string;
};
