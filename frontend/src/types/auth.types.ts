export interface ISocialLink {
  platform: string;
  url: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'USER' | 'AUTHOR' | 'ADMIN' | string;
  avatar?: string | null;
  bio?: string | null;
  socialLinks?: ISocialLink[];
  joinedAt?: string;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterCredentials {
  username?: string;
  email?: string;
  password?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
