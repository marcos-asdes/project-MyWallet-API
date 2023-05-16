import express from 'express';
import schemaValidationMiddleware from '../middlewares/schemaValidationMiddleware.js';
import * as schema from '../schemas/authSchema.js';
import {
  signInController,
  signUpController,
  signOutController
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post(
  '/sign-up',
  schemaValidationMiddleware(schema.signUpSchema),
  signUpController
);
authRouter.post(
  '/sign-in',
  schemaValidationMiddleware(schema.signInSchema),
  signInController
);
authRouter.get('/sign-out', signOutController);

export default authRouter;
