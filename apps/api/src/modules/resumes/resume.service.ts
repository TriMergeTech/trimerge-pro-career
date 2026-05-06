import path from 'path';
import streamifier from 'streamifier';
import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { CandidateProfileModel } from '../candidates/candidate.model';
import { cloudinary } from '../../lib/cloudinary';

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
  format: string;
  original_filename?: string;
};

function uploadBufferToCloudinary(file: Express.Multer.File): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'trimerge/resumes',
        resource_type: 'raw',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary upload failed'));
          return;
        }

        resolve(result as CloudinaryUploadResult);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

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

    let uploadedFile: CloudinaryUploadResult;

    try {
      uploadedFile = await uploadBufferToCloudinary(file);
    } catch (error) {
      throw new AppError('Failed to upload resume to cloud storage', 500);
    }

    profile.resumeUrl = uploadedFile.secure_url;
    await profile.save();

    return {
      message: 'Resume uploaded successfully.',
      resume: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        resumeUrl: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        extension: path.extname(file.originalname).toLowerCase(),
        format: uploadedFile.format,
      },
    };
  },
};