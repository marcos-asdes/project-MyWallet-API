import express from 'express';

import { getUser } from '../middlewares/getUserMiddleware.js';

import {
  getTransactions,
  addTransactions
} from '../controllers/transactionsController.js';

const transactionsRouter = express.Router();

transactionsRouter.use(getUser);

transactionsRouter.get('/transactions', getTransactions);
transactionsRouter.post('/transactions', addTransactions);

export default transactionsRouter;
