import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

export const validationMiddleware = (schema: ObjectSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(err);
  }
};
