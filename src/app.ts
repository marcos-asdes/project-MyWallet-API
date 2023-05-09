import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import 'express-async-errors';

import router from './routes/index.js';
import { apiLimiter } from './middlewares/rateLimiterMiddleware.js';
import errorHandler from './events/errorHandler.js';

dotenv.config({ path: '.env' });

const app = express();

app.use(json());
app.use(cors());
app.use(helmet());
app.use(router);
app.use(errorHandler);
app.use(apiLimiter);

export default app;

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
