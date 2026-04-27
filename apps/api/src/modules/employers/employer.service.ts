import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { EmployerProfileModel } from './employer.model';
import { CreateEmployerProfileInput, UpdateEmployerProfileInput } from './employer.schemas';

export const employerService = {
  async create(userId: string, input: CreateEmployerProfileInput) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.accountType !== 'EMPLOYER') {
      throw new AppError('Forbidden', 403);
    }

    const existingProfile = await EmployerProfileModel.findOne({ userId });
    if (existingProfile) {
      throw new AppError('Employer profile already exists', 409);
    }

    const profile = await EmployerProfileModel.create({
      userId,
      ...input,
    });

    return { profile };
  },

  async getMe(userId: string) {
    const profile = await EmployerProfileModel.findOne({ userId });

    if (!profile) {
      throw new AppError('Employer profile not found', 404);
    }

    return { profile };
  },

  async updateMe(userId: string, input: UpdateEmployerProfileInput) {
    const profile = await EmployerProfileModel.findOneAndUpdate(
      { userId },
      { $set: input },
      { new: true }
    );

    if (!profile) {
      throw new AppError('Employer profile not found', 404);
    }

    return { profile };
  },
};