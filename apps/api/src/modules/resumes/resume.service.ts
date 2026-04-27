import path from 'path';
import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { CandidateProfileModel } from '../candidates/candidate.model';

export const resumeService = {
  async upload(userId: string, file: Express.Multer.File) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.accountType !== 'TALENT') {
      throw new AppError('Forbidden', 403);
    }

    if (!file) {
      throw new AppError('Resume file is required', 400);
    }

    const profile = await CandidateProfileModel.findOne({ userId });

    if (!profile) {
      throw new AppError('Candidate profile not found', 404);
    }

    const resumeUrl = `/uploads/resumes/${file.filename}`;

    profile.resumeUrl = resumeUrl;
    await profile.save();

    return {
      message: 'Resume uploaded successfully.',
      resume: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        resumeUrl,
        extension: path.extname(file.originalname).toLowerCase(),
      },
    };
  },
};