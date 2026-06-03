import { Request, Response, NextFunction } from 'express';
import { publicJobService } from './public-jobs.service';

export const listPublicJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await publicJobService.list(req.query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPublicJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await publicJobService.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};