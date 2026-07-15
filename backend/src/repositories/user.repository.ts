import User from '../models/user.model';
import { IUserDocument, ISocialLink } from '../interfaces/user.interface';

class UserRepository {
  async findById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async findByUsername(username: string): Promise<IUserDocument | null> {
    return User.findOne({ username });
  }

  async updateProfile(
    id: string,
    data: {
      username?: string;
      bio?: string;
      socialLinks?: ISocialLink[];
    },
  ): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
  }

  async updateAvatar(id: string, avatarPath: string): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(
      id,
      { $set: { avatar: avatarPath } },
      { new: true, runValidators: true },
    );
  }

  async updateRole(id: string, role: string): Promise<IUserDocument | null> {
    return User.findByIdAndUpdate(id, { $set: { role } }, { new: true, runValidators: true });
  }
}

export default new UserRepository();
