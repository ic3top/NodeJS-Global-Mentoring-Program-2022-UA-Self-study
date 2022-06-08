import Joi from 'joi';

export const userSchema = {
  login: Joi.string().alphanum().min(3).max(30),
  password: Joi.string().alphanum().min(8).max(100),
  age: Joi.number().integer().min(4).max(130),
};

export const userSchemaOptional = Joi.object(userSchema);
export const userSchemaRequired = Joi.object(userSchema)
  .fork(Object.keys(userSchema), (schema) => schema.required());
