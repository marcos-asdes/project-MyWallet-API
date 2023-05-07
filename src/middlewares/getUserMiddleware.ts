import { Request, Response, NextFunction } from 'express';
import database from '../config.js';

export async function getUser(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer', '').trim();

  if (!token) return res.status(401).send('No token found.'); // error unauthorized

  try {
    const session = await database.collection('sessions').findOne({ token });
    if (!session) return res.status(401).send('No session found'); // error unauthorized

    const user = await database
      .collection('users')
      .findOne({ _id: session.userId });
    if (!user) return res.status(401).send('No user found'); // error unauthorized

    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
