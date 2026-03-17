import api from './axios';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  storeId?: number;
  storeName?: string;
  hourlyRate?: number;
  status: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
  needPasswordChange?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: string[];
}

const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/forgot-password', { email });
    return response.data;
  },

  getPasswordResetRequests: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/auth/password-reset-requests');
    return response.data;
  },

  approvePasswordReset: async (id: number, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`/auth/password-reset-requests/${id}/approve`, { newPassword });
    return response.data;
  },

  rejectPasswordReset: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>(`/auth/password-reset-requests/${id}/reject`);
    return response.data;
  },

  changePassword: async (data: any): Promise<ApiResponse<void>> => {
    const response = await api.put<ApiResponse<void>>('/auth/change-password', data);
    return response.data;
  },

  changeInitialPassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    const response = await api.post<ApiResponse<void>>('/auth/change-initial-password', { currentPassword, newPassword });
    return response.data;
  },
};

export default authService;








