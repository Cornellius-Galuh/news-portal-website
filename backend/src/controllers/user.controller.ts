import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { sendSuccess } from '../utils/api-response';

class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.getProfile(req.user!._id.toString());
      sendSuccess(res, result, 'User profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPublicProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await userService.getPublicProfile(id);
      sendSuccess(res, result, 'Public user profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, bio, socialLinks } = req.body;
      const result = await userService.updateProfile(req.user!._id.toString(), {
        username,
        bio,
        socialLinks,
      });
      sendSuccess(res, result, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.uploadAvatar(req.user!._id.toString(), req.file);
      sendSuccess(res, result, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
