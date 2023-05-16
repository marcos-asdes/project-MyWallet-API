import express from 'express';
import swaggerUi from 'swagger-ui-express';
import authRouter from './authRouter.js';
import transactionsRouter from './transactionsRouter.js';
import swaggerDocs from '../../swagger.json' assert { type: 'json' };
import { routeLog } from '../events/routeLog.js';

const router = express.Router();

const api = '/api';
const doc = api + '/doc';

router.use(doc, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use(api, authRouter);
router.use(api, transactionsRouter);

router.use(routeLog);

export default router;
