import { Request, Response, NextFunction } from 'express';
import { jobService } from './job.service';

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.create(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const listJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.list(req.query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.update(req.user!.userId, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.remove(req.user!.userId, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const result = await jobService.getMyJobs(req.user!.userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await jobService.getEmployerStats(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};