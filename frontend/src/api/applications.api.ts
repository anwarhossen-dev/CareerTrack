import axiosInstance from './axios';
import type { Application, DashboardData, AdminDashboardData } from '../types';

interface ListParams {
  search?: string;
  status?: string;
  source?: string;
  sort?: string;
}

interface ListResponse {
  applications: Application[];
}

interface SingleResponse {
  application: Application;
}

interface MessageResponse {
  message: string;
  application?: Application;
}

export const listApplications = async (params: ListParams = {}): Promise<ListResponse> => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  if (params.source) queryParams.append('source', params.source);
  if (params.sort) queryParams.append('sort', params.sort);

  const response = await axiosInstance.get<ListResponse>(`/applications?${queryParams.toString()}`);
  return response.data;
};

export const createApplication = async (data: Partial<Application>): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>('/applications', data);
  return response.data;
};

export const fetchApplicationById = async (id: string): Promise<SingleResponse> => {
  const response = await axiosInstance.get<SingleResponse>(`/applications/${id}`);
  return response.data;
};

export const updateApplication = async (id: string, data: Partial<Application>): Promise<MessageResponse> => {
  const response = await axiosInstance.patch<MessageResponse>(`/applications/${id}`, data);
  return response.data;
};

export const deleteApplication = async (id: string): Promise<MessageResponse> => {
  const response = await axiosInstance.delete<MessageResponse>(`/applications/${id}`);
  return response.data;
};

export const fetchDashboardStats = async (): Promise<DashboardData> => {
  const response = await axiosInstance.get<DashboardData>('/dashboard/stats');
  return response.data;
};

export const fetchAdminStats = async (): Promise<AdminDashboardData> => {
  const response = await axiosInstance.get<AdminDashboardData>('/dashboard/admin/stats');
  return response.data;
};
