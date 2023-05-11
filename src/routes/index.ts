import express from 'express';

import authRouter from './authRouter.js';
import transactionsRouter from './transactionsRouter.js';
import { routeLog } from '../events/routeLog.js';

const router = express.Router();

const api = '/api';

router.use(api, authRouter);
router.use(api, transactionsRouter);

router.use(routeLog);

export default router;
