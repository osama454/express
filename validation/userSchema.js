// Example: ./validation/userSchema.js
const Joi = require('joi');

const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  
  const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    });


module.exports = {createUserSchema, loginUserSchema};