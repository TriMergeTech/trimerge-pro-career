import { Request, Response, NextFunction } from 'express';
import { bookmarkService } from './bookmark.service';

export const createBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookmarkService.create(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyBookmarks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const result = await bookmarkService.getMyBookmarks(req.user!.userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bookmarkService.remove(req.user!.userId, req.params.jobId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};