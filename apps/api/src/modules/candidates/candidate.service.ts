import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { CandidateProfileModel } from './candidate.model';
import { CreateCandidateProfileInput, UpdateCandidateProfileInput } from './candidate.schemas';

export const candidateService = {
  async create(userId: string, input: CreateCandidateProfileInput) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.accountType !== 'TALENT') {
      throw new AppError('Forbidden', 403);
    }

    const existingProfile = await CandidateProfileModel.findOne({ userId });
    if (existingProfile) {
      throw new AppError('Candidate profile already exists', 409);
    }

    const profile = await CandidateProfileModel.create({
      userId,
      ...input,
    });

    return { profile };
  },

  async getMe(userId: string) {
    const profile = await CandidateProfileModel.findOne({ userId });

    if (!profile) {
      throw new AppError('Candidate profile not found', 404);
    }

    return { profile };
  },

  async updateMe(userId: string, input: UpdateCandidateProfileInput) {
    const profile = await CandidateProfileModel.findOneAndUpdate(
      { userId },
      { $set: input },
      { new: true }
    );

    if (!profile) {
      throw new AppError('Candidate profile not found', 404);
    }

    return { profile };
  },

  async getById(id: string) {
    const profile = await CandidateProfileModel.findById(id);

    if (!profile) {
      throw new AppError('Candidate profile not found', 404);
    }

    return { profile };
  },
};