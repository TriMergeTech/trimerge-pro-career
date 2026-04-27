import { Request, Response, NextFunction } from 'express';
import { candidateService } from './candidate.service';

export const createCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await candidateService.create(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await candidateService.getMe(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateMyCandidateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await candidateService.updateMe(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getCandidateProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await candidateService.getById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};