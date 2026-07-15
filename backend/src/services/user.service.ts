import path from 'path';
import fs from 'fs';
import userRepository from '../repositories/user.repository';
import AppError from '../utils/app-error';
import { IUserDocument, ISocialLink } from '../interfaces/user.interface';

class UserService {
  private formatProfile(user: IUserDocument, includeEmail: boolean = true) {
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, isDeleted, deletedAt, updatedAt, __v, ...cleanUser } = userObj;

    if (!includeEmail) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { email, ...publicUser } = cleanUser;
      return publicUser;
    }

    return cleanUser;
  }

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return this.formatProfile(user, true);
  }

  async getPublicProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return this.formatProfile(user, false);
  }

  async updateProfile(
    userId: string,
    data: {
      username?: string;
      bio?: string;
      socialLinks?: ISocialLink[];
    },
  ) {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw new AppError('User not found.', 404);
    }

    // Check username uniqueness if changing username
    if (data.username && data.username !== currentUser.username) {
      const existingUser = await userRepository.findByUsername(data.username);
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new AppError('Username already taken.', 409);
      }
    }

    const updatedUser = await userRepository.updateProfile(userId, data);
    if (!updatedUser) {
      throw new AppError('Failed to update user profile.', 500);
    }

    return this.formatProfile(updatedUser, true);
  }

  async uploadAvatar(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new AppError('Please upload an image file.', 400);
    }

    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      // If user not found, delete the uploaded file immediately
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw new AppError('User not found.', 404);
    }

    // Remove old custom avatar file if it exists inside local storage
    if (currentUser.avatar && currentUser.avatar.includes('uploads/profiles/')) {
      const oldRelativePath = currentUser.avatar.replace(/^\//, ''); // remove leading slash if present
      const oldAbsolutePath = path.join(__dirname, '../../', oldRelativePath);
      if (fs.existsSync(oldAbsolutePath)) {
        try {
          fs.unlinkSync(oldAbsolutePath);
        } catch {
          // Ignore deletion error if file is locked or missing
        }
      }
    }

    // Save only relative file path into MongoDB
    const relativeAvatarPath = `/uploads/profiles/${file.filename}`;
    const updatedUser = await userRepository.updateAvatar(userId, relativeAvatarPath);
    if (!updatedUser) {
      throw new AppError('Failed to update avatar in database.', 500);
    }

    return this.formatProfile(updatedUser, true);
  }
}

export default new UserService();
