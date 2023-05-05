import dayjs from 'dayjs';

import database from '../database.js';

import transactionsSchema from "./../schemas/transactionsSchema.js";

export async function getTransactions(req, res) {
    const { user } = res.locals;
    try {
        const transactions = await database.collection("transactions").find({ userId: user._id }).toArray();
        res.send(transactions);
    } catch (error) {
        console.log('Error getting all financial transactions', error);
        return res.sendStatus(500);
    }
}

export async function addTransactions(req, res) {
    const { error } = transactionsSchema.validate(req.body);
    if(error) return res.status(422).send(error.details.map(detail => detail.message)); // unprocessable entity

    const { user } = res.locals;
    try {
        const { type, description, value } = req.body;
        await database.collection('transactions').insertOne({
            type,
            value,
            description, 
            date: dayjs().format('DD/MM'),
            userId: user._id
        });
        res.sendStatus(201);
    } catch (error) {
        console.log('Error adding new transaction', error);
        return res.sendStatus(500);
    }
}