import bcrypt from 'bcrypt';
import authRepository from '../repositories/auth.repository';
import userRepository from '../repositories/user.repository';
import { generateToken } from '../utils/jwt.util';
import AppError from '../utils/app-error';
import { IUserDocument } from '../interfaces/user.interface';

class AuthService {
  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: Partial<IUserDocument>; token: string }> {
    // Check if email already exists
    const emailExists = await authRepository.emailExists(data.email);
    if (emailExists) {
      throw new AppError('Email already registered.', 409);
    }

    // Check if username already exists
    const usernameExists = await authRepository.usernameExists(data.username);
    if (usernameExists) {
      throw new AppError('Username already taken.', 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user without password
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userObj;

    return { user: userWithoutPassword, token };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: Partial<IUserDocument>; token: string }> {
    // Find user by email (with password)
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user without password
    const userObj = user.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = userObj;

    return { user: userWithoutPassword, token };
  }

  async getCurrentUser(userId: string): Promise<IUserDocument> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }
    return user;
  }
}

export default new AuthService();
