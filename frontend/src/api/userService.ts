import api from './axios';
import { User, ApiResponse } from './authService';

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'OWNER' | 'MANAGER' | 'STAFF';
  storeId?: number;
  hourlyRate?: number;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: 'OWNER' | 'MANAGER' | 'STAFF';
  storeId?: number;
  hourlyRate?: number;
  status?: 'ACTIVE' | 'INACTIVE';
  avatarUrl?: string;
}

const userService = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<any>>('/users');
    if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
      return { ...response.data, data: response.data.data.content };
    }
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  update: async (id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  getByStore: async (storeId: number): Promise<ApiResponse<User[]>> => {
    const response = await api.get<ApiResponse<any>>(`/users/store/${storeId}`);
    if (response.data && response.data.data && Array.isArray(response.data.data.content)) {
      return { ...response.data, data: response.data.data.content };
    }
    return response.data;
  },
};

export default userService;








