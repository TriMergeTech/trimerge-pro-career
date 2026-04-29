import { Request, Response, NextFunction } from 'express';
import { onboardingService } from './onboarding.service';

export const registerOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOnboardingEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.verifyEmail(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resendOnboardingVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.resendVerification(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOnboardingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.getStatus(req.user!.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const saveCandidateStep2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.saveCandidateStep2(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const saveCandidateStep3 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.saveCandidateStep3(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const saveRecruiterStep2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.saveRecruiterStep2(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const saveRecruiterStep3 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await onboardingService.saveRecruiterStep3(req.user!.userId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};