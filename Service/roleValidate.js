const Joi = require('joi');

const UserSchema = Joi.object({
        role_name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'role name should be a string',
            'string.empty': 'role name is required',
            'string.min': 'role name should have at least 3 characters',
            'any.required': 'Role name is required'
        })
}).unknown(false);

module.exports = UserSchema;