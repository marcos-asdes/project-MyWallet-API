import bcrypt from 'bcrypt'; // data encrypting
import { Request, Response, NextFunction } from 'express';
import db from '../config.js';

async function signUpController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const SALT = 10;
    const passwordHash = bcrypt.hashSync(req.body.password, SALT); // encrypting password

    // store data in the database
    await db.collection('users').insertOne({
      name: req.body.name,
      email: req.body.email,
      password: passwordHash
    });

    return res.sendStatus(201); // created
  } catch (error) {
    console.log('Error creating new user', error);
    return res.sendStatus(500);
  }
}

async function signInController(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const user = await db.collection('users').findOne({
      email: req.body.email
    });
    if (!user) return res.sendStatus(404); // not found error

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = uuid();
      await db.collection('sessions').insertOne({
        token,
        userId: user._id
      });
      return res.send({ token, name: user.name });
    }

    return res.sendStatus(404); // not found error
  } catch (error) {
    console.log('Error recovering user', error);
    return res.sendStatus(500);
  }
}

async function signOutController(req: Request, res: Response) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer', '').trim();
  if (!token) return res.sendStatus(403); // forbidden error

  try {
    await db.collection('sessions').deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    console.log('Error logging out', error);
    return res.sendStatus(500);
  }
}

export { signInController, signUpController, signOutController };
