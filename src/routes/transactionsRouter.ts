import express from 'express';

/* import { getUser } from '../middlewares/getUserMiddleware.js'; */

import {
  getTransactionsController,
  addTransactionsController
} from '../controllers/transactionsController.js';

const transactionsRouter = express.Router();

/* transactionsRouter.use(getUser); */

transactionsRouter.get('/transactions', getTransactionsController);
transactionsRouter.post('/transactions', addTransactionsController);

export default transactionsRouter;
