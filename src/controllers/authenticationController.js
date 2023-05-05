import bcrypt from 'bcrypt'; // data encrypting
import { v4 as uuid } from 'uuid';

import database from '../database.js';

export async function signUp(req, res) {
    try {
        const SALT = 10;
        const passwordHash = bcrypt.hashSync(req.body.password, SALT); // encrypting password

        // store data in the database
        await database.collection('users').insertOne({
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

export async function signIn(req, res) {
    try {
        const user = await database.collection('users').findOne({
            email: req.body.email
        })
        if (!user) return res.sendStatus(404); // not found error

        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = uuid();
            await database.collection('sessions').insertOne({
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

export async function signOut(req, res) {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer', '').trim();
    if (!token) return res.sendStatus(403); // forbidden error

    try {
        await database.collection('sessions').deleteOne({ token });
        res.sendStatus(200);
    } catch (error) {
        console.log('Error logging out', error);
        return res.sendStatus(500);
    }
}