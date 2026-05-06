import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/app-error';
import { resumeService } from './resume.service';

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('Resume file is required', 400);
    }

    const result = await resumeService.upload(req.user!.userId, req.file as Express.Multer.File);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};