import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/api-response';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register({ username, email, password });

      sendCreated(res, result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Stateless JWT — logout is handled client-side by removing the token.
      // This endpoint exists for API completeness.
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getCurrentUser(req.user!._id.toString());

      sendSuccess(res, { user }, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
