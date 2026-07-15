import User from '../models/user.model';
import { IUserDocument } from '../interfaces/user.interface';

class AuthRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email }).select('+password');
  }

  async createUser(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<IUserDocument> {
    return User.create(data);
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await User.findOne({ username });
    return !!user;
  }
}

export default new AuthRepository();
