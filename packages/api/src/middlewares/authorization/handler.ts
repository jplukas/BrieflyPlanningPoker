import { Unauthorized } from '../error/error';
import { Response, Request, NextFunction } from 'express';
import * as auth from './authorization';

function handler(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  const isValid = token?.includes('Bearer') ? auth.verify(token.replace('Bearer', '').trim()) : false;

  try {
    if (isValid?.role === 'login') {
      req.body.user = isValid.user;
      next();
    } else {
      throw new Unauthorized('Invalid token');
    }
  } catch (error: unknown) {
    next(error);
  }
}

export { handler };
