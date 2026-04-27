import { Request, Response, NextFunction } from 'express';
import { employerService } from './employer.service';

export const createEmployerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await employerService.create(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyEmployerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await employerService.getMe(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateMyEmployerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await employerService.updateMe(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};