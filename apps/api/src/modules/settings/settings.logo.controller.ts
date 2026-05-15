import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/app-error';
import { settingsLogoService } from './settings.logo.service';

export const uploadCompanyLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError('Company logo file is required', 400);
    }

    const result = await settingsLogoService.uploadCompanyLogo(
      req.user!.userId,
      req.file as Express.Multer.File
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};