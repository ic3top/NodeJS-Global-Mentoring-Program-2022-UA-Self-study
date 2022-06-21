import { verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '../preload';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const {
    authorization,
  } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .json({ message: 'Please, provide "authorization" header' });
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Please, include token to request' });
  }

  try {
    verify(token, JWT_SECRET as string);
    next();
  } catch (err: any) {
    res.status(403).json({ message: err.message });
  }
};
