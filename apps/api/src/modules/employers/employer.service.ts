import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { EmployerProfileModel } from './employer.model';
import { JobModel } from '../jobs/job.model';
import { ApplicationModel } from '../applications/application.model';
import { CreateEmployerProfileInput, UpdateEmployerProfileInput } from './employer.schemas';

function normalizePrimaryHiringNeeds(primaryHiringNeeds?: string | string[]): string[] | undefined {
  if (primaryHiringNeeds === undefined) {
    return undefined;
  }

  if (Array.isArray(primaryHiringNeeds)) {
    return primaryHiringNeeds.map((item) => item.trim()).filter(Boolean);
  }

  return primaryHiringNeeds
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

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
      primaryHiringNeeds: normalizePrimaryHiringNeeds(input.primaryHiringNeeds),
    });

    return { profile };
  },

  async getMe(userId: string) {
    const profile = await EmployerProfileModel.findOne({ userId });

    if (!profile) {
      throw new AppError('Employer profile not found', 404);
    }

    return {
      profile: {
        ...profile.toObject(),
        primaryHiringNeeds: normalizePrimaryHiringNeeds(
          profile.primaryHiringNeeds as unknown as string | string[]
        ),
      },
    };
  },

  async updateMe(userId: string, input: UpdateEmployerProfileInput) {
    const normalizedInput = {
      ...input,
      ...(input.primaryHiringNeeds !== undefined
        ? { primaryHiringNeeds: normalizePrimaryHiringNeeds(input.primaryHiringNeeds) }
        : {}),
    };

    const profile = await EmployerProfileModel.findOneAndUpdate(
      { userId },
      { $set: normalizedInput },
      { new: true }
    );

    if (!profile) {
      throw new AppError('Employer profile not found', 404);
    }

    return { profile };
  },

  async getById(id: string) {
    const profile = await EmployerProfileModel.findById(id);

    if (!profile) {
      throw new AppError('Employer profile not found', 404);
    }

    const user = await UserModel.findById(profile.userId).select(
      '_id email accountType isVerified status profile createdAt updatedAt'
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const jobs = await JobModel.find({ employerId: user._id }).select('_id status title location employmentType createdAt');

    const jobIds = jobs.map((job) => job._id);

    const [
      totalJobs,
      openJobs,
      closedJobs,
      draftJobs,
      totalApplications,
      recentJobs,
    ] = await Promise.all([
      JobModel.countDocuments({ employerId: user._id }),
      JobModel.countDocuments({ employerId: user._id, status: 'OPEN' }),
      JobModel.countDocuments({ employerId: user._id, status: 'CLOSED' }),
      JobModel.countDocuments({ employerId: user._id, status: 'DRAFT' }),
      jobIds.length ? ApplicationModel.countDocuments({ jobId: { $in: jobIds } }) : 0,
      JobModel.find({ employerId: user._id })
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return {
      employer: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        isVerified: user.isVerified,
        status: user.status,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      employerProfile: {
        ...profile.toObject(),
        primaryHiringNeeds: normalizePrimaryHiringNeeds(
          profile.primaryHiringNeeds as unknown as string | string[]
        ),
      },
      jobSummary: {
        totalJobs,
        openJobs,
        closedJobs,
        draftJobs,
        totalApplications,
      },
      recentJobs,
    };
  },
};