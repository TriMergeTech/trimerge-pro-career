import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { JobModel } from '../jobs/job.model';
import { BookmarkModel } from './bookmark.model';
import { CreateBookmarkInput } from './bookmark.schemas';

export const bookmarkService = {
  async create(candidateId: string, input: CreateBookmarkInput) {
    const user = await UserModel.findById(candidateId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.accountType !== 'TALENT') {
      throw new AppError('Forbidden', 403);
    }

    const job = await JobModel.findById(input.jobId);
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const existing = await BookmarkModel.findOne({
      candidateId,
      jobId: input.jobId,
    });

    if (existing) {
      throw new AppError('Job already bookmarked', 409);
    }

    const bookmark = await BookmarkModel.create({
      candidateId,
      jobId: input.jobId,
    });

    return { bookmark };
  },

  async getMyBookmarks(candidateId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      BookmarkModel.find({ candidateId })
        .populate('jobId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      BookmarkModel.countDocuments({ candidateId }),
    ]);

    return {
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async remove(candidateId: string, jobId: string) {
    const bookmark = await BookmarkModel.findOneAndDelete({
      candidateId,
      jobId,
    });

    if (!bookmark) {
      throw new AppError('Bookmark not found', 404);
    }

    return { message: 'Bookmark removed successfully.' };
  },
};