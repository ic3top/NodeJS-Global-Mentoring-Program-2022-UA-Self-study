import Joi from 'joi';
import { Permissions } from '../models/group';

const groupSchema = {
  name: Joi.string().alphanum().min(3).max(140),
  permissions: Joi.array().items(
    Joi.string().valid(
      ...Object.values(Permissions),
    ),
  ).min(1),
};

export const groupSchemaOptional = Joi.object(groupSchema);
export const groupSchemaRequired = Joi.object(groupSchema)
  .fork(Object.keys(groupSchema), (schema) => schema.required());
