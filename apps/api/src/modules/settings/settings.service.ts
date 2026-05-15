import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/app-error';
import { UserModel } from '../users/user.model';
import { RefreshTokenModel } from '../auth/refresh-token.model';
import { ChangePasswordInput } from './settings.schemas';
import { env } from '../../config/env';

export const settingsService = {
  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const passwordMatches = await bcrypt.compare(input.currentPassword, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('Current password is incorrect', 400);
    }

    if (input.currentPassword === input.newPassword) {
      throw new AppError('New password must be different from current password', 400);
    }

    const newPasswordHash = await bcrypt.hash(input.newPassword, Number(env.BCRYPT_ROUNDS));
    user.passwordHash = newPasswordHash;
    await user.save();

    await RefreshTokenModel.updateMany(
      { userId: user._id, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } }
    );

    return {
      message: 'Password changed successfully. Please log in again.',
    };
  },
};