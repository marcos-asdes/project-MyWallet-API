import { signUpSchema, signInSchema } from "../schemas/authenticationSchema.js";

export function validateSignIn(req, res, next) {
    const { error } = signInSchema.validate(req.body);
    if(error) {
        return res.sendStatus(422); // unprocessable entity
    }
    next();
}

export function validadeSignUp(req, res, next) {
    const { error } = signUpSchema.validate(req.body);
    if(error) {
        return res.sendStatus(422); // unprocessable entity
    }
    next();
}