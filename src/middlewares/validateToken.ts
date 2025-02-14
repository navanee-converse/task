import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretekey = process.env.SECRETE_KEY;
const err: Error = new Error();

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers;
    if (secretekey !== undefined && header.authorization !== undefined) {
      const token = header.authorization.split(' ')[1];
      const user = jwt.verify(token, secretekey) as {
        id: string;
        name: string;
      }; //it verify token

      req.user = user;
      next();
    } else {
      err.name = 'TokenError';
      err.message = 'No token or secrete key';
      next(err);
    }
  } catch (err) {
    next(err);
  }
}
