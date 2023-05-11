import express from 'express';

import {
  signInController,
  signUpController,
  signOutController
} from '../controllers/authController.js';

import {
  validateSignIn,
  validadeSignUp
} from '../middlewares/validateAuthMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signin', validateSignIn, signInController);
authRouter.post('/signup', validadeSignUp, signUpController);
authRouter.get('/signout', signOutController);

export default authRouter;
