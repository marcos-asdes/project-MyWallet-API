import express from 'express';

import {
  validateSignIn,
  validadeSignUp
} from '../middlewares/validateAuthenticationMiddleware.js';

import {
  signIn,
  signUp,
  signOut
} from '../controllers/authenticationController.js';

const authenticationRouter = express.Router();

authenticationRouter.post('/signin', validateSignIn, signIn);
authenticationRouter.post('/signup', validadeSignUp, signUp);
authenticationRouter.get('/signout', signOut);

export default authenticationRouter;
