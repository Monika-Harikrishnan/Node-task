const Joi = require('joi');

const ProductSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'Name should be a string',
            'string.empty': 'Name is required',
            'string.min': 'Name should have at least 3 characters',
        }),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Quantity should be a number',
            'number.empty': 'Quantity is required',
            'number.min': 'Quantity must be at least 1',
        }),
    price: Joi.number()
        .min(1)
        .required()
        .messages({
            'number.base': 'Price should be a number',
            'number.empty': 'Price is required',
            'number.min': 'Price must be at least 1',
        })
});

module.exports = ProductSchema;