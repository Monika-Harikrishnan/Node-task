const Joi = require('joi');

const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const UserSchema = Joi.object({
    firstname: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'Firstname should be a string',
            'string.empty': 'Firstname is required',
            'string.min': 'Firstname should have at least 3 characters',
            'any.required': 'Firstname is required'
        }),
        lastname: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'Lastname should be a string',
            'string.empty': 'Lastname is required',
            'string.min': 'Lastname should have at least 3 characters',
            'any.required': 'lastname is required'
        }),
        email: Joi.string()
        .email({ tlds: { allow: false } }) 
        .required()
        .messages({
            'string.base': 'Email should be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required'
        }),
        phonenumber: Joi.string()
        .regex(/^\d{10}$/)
        .required()
        .messages({
            'string.base': 'Phone number should be a string of digits',
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must contain exactly 10 digits',
            'any.required': 'Phone number is required'
        }),
        password: Joi.string()
        .min(6) 
        .required()
        .messages({
            'string.base': 'Password should be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password should have at least 6 characters',
            'any.required': 'Password is required'
        }),
        reenter_password: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'string.base': 'Re-enter Password should be a string',
            'string.empty': 'Re-enter Password is required',
            'any.required': 'Re-enter Password is required',
            'any.only': 'Re-enter Password must match the Password'
        }),
        role_id: Joi.string()
        .pattern(objectIdPattern)
        .required()
        .messages({
           'string.base': 'Role ID should be a string',
           'string.empty': 'Role ID is required',
           'string.pattern.base': 'Role ID should be a valid ObjectId',
           'any.required': 'Role ID is required',
        })

}).unknown(false);

module.exports = UserSchema;