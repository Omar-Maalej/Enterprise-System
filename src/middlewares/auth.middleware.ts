import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['auth-user'] as string;
    console.log(token);

    
    if (token) {
      try {
        //console.log(process.env.JWT_SECRET);
        const decodedToken: any = verify(token, "your-256-bit-secret");
        //console.log(decodedToken);
        req['userId'] = decodedToken['userId']; 
        next();
      } catch (err) {
        res.json({ message: 'Token invalide' });
      }
    } else {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }


  }
}