import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { JobModel } from '../jobs/job.model';
import { ApplicationModel } from './application.model';
import { CreateApplicationInput, UpdateApplicationStatusInput } from './application.schemas';

export const applicationService = {
  async create(candidateId: string, input: CreateApplicationInput) {
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

    if (job.status !== 'OPEN') {
      throw new AppError('Job is not open for applications', 400);
    }

    const existing = await ApplicationModel.findOne({
      jobId: input.jobId,
      candidateId,
    });

    if (existing) {
      throw new AppError('You have already applied to this job', 409);
    }

    const application = await ApplicationModel.create({
      jobId: input.jobId,
      candidateId,
      coverLetter: input.coverLetter,
      status: 'PENDING',
    });

    return { application };
  },

  async getMyApplications(candidateId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      ApplicationModel.find({ candidateId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ApplicationModel.countDocuments({ candidateId }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getApplicationsForJob(employerId: string, jobId: string, page = 1, limit = 10) {
    const job = await JobModel.findById(jobId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.employerId.toString() !== employerId) {
      throw new AppError('Forbidden', 403);
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      ApplicationModel.find({ jobId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ApplicationModel.countDocuments({ jobId }),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async updateStatus(employerId: string, applicationId: string, input: UpdateApplicationStatusInput) {
    const application = await ApplicationModel.findById(applicationId);

    if (!application) {
      throw new AppError('Application not found', 404);
    }

    const job = await JobModel.findById(application.jobId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (job.employerId.toString() !== employerId) {
      throw new AppError('Forbidden', 403);
    }

    application.status = input.status;
    await application.save();

    return { application };
  },
};