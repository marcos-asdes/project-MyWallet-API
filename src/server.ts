import { Request, Response } from 'express';
import app from './app.js';
import logHandler from './events/logHandler.js';

let PORT: number;
if (process.env.PORT) {
  PORT = +process.env.PORT;
} else {
  PORT = 5000;
}

app.listen(PORT, () => {
  logHandler('Server', `Server listening on port ${PORT}`);
});

app.get('/', (_req: Request, res: Response) => {
  res.send(`
  Application online. 
  Server listening on port ${PORT}.
  `);
});
