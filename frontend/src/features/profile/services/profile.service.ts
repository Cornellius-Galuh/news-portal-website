import api from '../../../services/api';
import type { User, ISocialLink, ApiResponse } from '../../../types/auth.types';

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  socialLinks?: ISocialLink[];
}

class ProfileService {
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data.data;
  }

  async updateProfile(data: UpdateProfilePayload): Promise<User> {
    const response = await api.patch<ApiResponse<User>>('/users/profile', data);
    return response.data.data;
  }

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.patch<ApiResponse<User>>('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}

export const profileService = new ProfileService();
export default profileService;
