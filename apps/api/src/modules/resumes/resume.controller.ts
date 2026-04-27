import { Request, Response, NextFunction } from 'express';
import { resumeService } from './resume.service';

export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resumeService.upload(req.user!.userId, req.file as Express.Multer.File);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};