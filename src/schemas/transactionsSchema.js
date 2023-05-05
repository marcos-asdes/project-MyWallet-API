import joi from 'joi' // data validation

// validation -> joi
const transactionsSchema = joi.object({
    type: joi.string()
        .required(),
    description: joi.string()
        .required(),
    value: joi.number()
        .required()
});

export default transactionsSchema;