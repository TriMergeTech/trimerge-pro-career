import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};


export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.verifyOtp(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const resendOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resendOtp(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
