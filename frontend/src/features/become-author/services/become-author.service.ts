import api from '../../../services/api';
import type { ApiResponse, User } from '../../../types/auth.types';

export interface AuthorRequestData {
  _id: string;
  userId: string | User;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  reviewedAt?: string;
  reviewedBy?: string | User;
}

class BecomeAuthorService {
  async getMyRequest(): Promise<AuthorRequestData | null> {
    try {
      const response = await api.get<ApiResponse<AuthorRequestData | null>>('/users/become-author');
      return response.data.data;
    } catch {
      return null;
    }
  }

  async submitRequest(reason: string): Promise<AuthorRequestData> {
    const response = await api.post<ApiResponse<AuthorRequestData>>('/users/become-author', { reason });
    return response.data.data;
  }
}

export const becomeAuthorService = new BecomeAuthorService();
export default becomeAuthorService;
