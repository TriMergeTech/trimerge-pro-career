import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';

export const listAdminUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      ...req.query,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await adminService.listUsers(query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateAdminUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.updateUserStatus(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const listAdminJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = {
      ...req.query,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await adminService.listJobs(query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateAdminJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.updateJobStatus(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};