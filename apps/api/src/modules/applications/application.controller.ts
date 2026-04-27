import { Request, Response, NextFunction } from 'express';
import { applicationService } from './application.service';

export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.create(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.getMyApplications(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getApplicationsForJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.getApplicationsForJob(req.user!.userId, req.params.jobId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await applicationService.updateStatus(req.user!.userId, req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};