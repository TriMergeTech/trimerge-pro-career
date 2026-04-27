import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

type Role = 'EMPLOYER' | 'TALENT';

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    if (!allowedRoles.includes(req.user.accountType)) {
      return next(new AppError('Forbidden', 403));
    }

    next();
  };
}