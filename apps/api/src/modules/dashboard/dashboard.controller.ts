import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';

export const getCandidateDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dashboardService.getCandidateSummary(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployerDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dashboardService.getEmployerSummary(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployerRecentApplications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dashboardService.getEmployerRecentApplications(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployerApplicants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      ...req.query,
      page: Number(req.query.page ?? 1),
      limit: Number(req.query.limit ?? 10),
    };

    const result = await dashboardService.getEmployerApplicants(req.user!.userId, query as any);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getEmployerCandidateMatches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dashboardService.getEmployerCandidateMatches(
      req.user!.userId,
      req.params.jobId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};