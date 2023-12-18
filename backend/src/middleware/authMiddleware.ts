import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
      interface Request {
        user?: any; // Define the type according to what you store in user
      }
    }
  }
  
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'zero', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
