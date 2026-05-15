import { Request, Response, NextFunction } from 'express';
import { settingsService } from './settings.service';

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await settingsService.changePassword(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};