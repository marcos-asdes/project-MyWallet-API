import express from 'express';
import tokenValidationMiddleware from '../middlewares/tokenValidationMiddleware.js';
import schemaValidationMiddleware from '../middlewares/schemaValidationMiddleware.js';
import * as schema from '../schemas/transactionsSchema.js';
import {
  getTransactionsController,
  addTransactionsController
} from '../controllers/transactionsController.js';

const transactionsRouter = express.Router();

transactionsRouter.use(tokenValidationMiddleware);

transactionsRouter.post(
  '/transactions',
  schemaValidationMiddleware(schema.transactionsSchema),
  addTransactionsController
);
transactionsRouter.get('/transactions', getTransactionsController);

export default transactionsRouter;
