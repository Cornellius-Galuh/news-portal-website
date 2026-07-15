import api from '../../../services/api';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponseData,
  ApiResponse,
  User,
} from '../../../types/auth.types';

class AuthService {
  async register(data: RegisterCredentials): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return response.data.data;
  }

  async login(data: LoginCredentials): Promise<AuthResponseData> {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if API logout fails (e.g. expired token), we proceed to clear client auth state
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }
}

export const authService = new AuthService();
export default authService;
