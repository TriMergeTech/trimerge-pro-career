import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { JobModel } from '../jobs/job.model';
import {
  ListAdminJobsQuery,
  ListAdminUsersQuery,
  UpdateAdminJobStatusInput,
  UpdateAdminUserStatusInput,
} from './admin.schemas';

export const adminService = {
  async listUsers(query: ListAdminUsersQuery) {
    const { page, limit, accountType, status, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (accountType) filter.accountType = accountType;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } },
        { 'profile.companyName': { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .select('_id email accountType isVerified status profile lastLoginAt createdAt updatedAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      UserModel.countDocuments(filter),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateUserStatus(userId: string, input: UpdateAdminUserStatusInput) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.status = input.status;
    await user.save();

    return {
      message: 'User status updated successfully.',
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        status: user.status,
      },
    };
  },

  async listJobs(query: ListAdminJobsQuery) {
    const { page, limit, status, search } = query;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const [jobs, total] = await Promise.all([
      JobModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      JobModel.countDocuments(filter),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateJobStatus(jobId: string, input: UpdateAdminJobStatusInput) {
    const job = await JobModel.findById(jobId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    job.status = input.status;
    await job.save();

    return {
      message: 'Job status updated successfully.',
      job,
    };
  },
};