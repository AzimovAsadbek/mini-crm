import { api } from '@/lib/axios';
import type {
  AuthResponse,
  Customer,
  CustomerDetail,
  DashboardStats,
  ListQuery,
  Paginated,
  Project,
  ProjectDetail,
  Task,
  User,
} from '@/types';

/** Bo'sh qiymatlarni query stringdan olib tashlaydi. */
function cleanParams<T extends object>(params: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value != null),
  );
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', payload).then((res) => res.data),

  register: (payload: { fullname: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', payload).then((res) => res.data),

  logout: (refreshToken: string | null) =>
    api.post('/auth/logout', refreshToken ? { refreshToken } : {}).then((res) => res.data),

  me: () => api.get<User>('/auth/me').then((res) => res.data),
};

export interface UserQuery extends ListQuery {
  role?: string;
}

export const usersApi = {
  list: (params: UserQuery) =>
    api.get<Paginated<User>>('/users', { params: cleanParams(params) }).then((res) => res.data),

  detail: (id: number) => api.get<User>(`/users/${id}`).then((res) => res.data),

  assignable: () =>
    api
      .get<Pick<User, 'id' | 'fullname' | 'email'>[]>('/users/assignable')
      .then((res) => res.data),

  create: (payload: Record<string, unknown>) =>
    api.post<User>('/users', payload).then((res) => res.data),

  update: (id: number, payload: Record<string, unknown>) =>
    api.patch<User>(`/users/${id}`, payload).then((res) => res.data),

  remove: (id: number) => api.delete(`/users/${id}`).then((res) => res.data),

  updateProfile: (payload: { fullname?: string; email?: string }) =>
    api.patch<User>('/users/me', payload).then((res) => res.data),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    api.patch('/users/me/password', payload).then((res) => res.data),
};

export const customersApi = {
  list: (params: ListQuery) =>
    api
      .get<Paginated<Customer>>('/customers', { params: cleanParams(params) })
      .then((res) => res.data),

  detail: (id: number) => api.get<CustomerDetail>(`/customers/${id}`).then((res) => res.data),

  select: () =>
    api
      .get<Pick<Customer, 'id' | 'companyName' | 'fullname'>[]>('/customers/select')
      .then((res) => res.data),

  create: (payload: Record<string, unknown>) =>
    api.post<Customer>('/customers', payload).then((res) => res.data),

  update: (id: number, payload: Record<string, unknown>) =>
    api.patch<Customer>(`/customers/${id}`, payload).then((res) => res.data),

  remove: (id: number) => api.delete(`/customers/${id}`).then((res) => res.data),
};

export interface ProjectQuery extends ListQuery {
  status?: string;
  customerId?: number | string;
}

export const projectsApi = {
  list: (params: ProjectQuery) =>
    api
      .get<Paginated<Project>>('/projects', { params: cleanParams(params) })
      .then((res) => res.data),

  detail: (id: number) => api.get<ProjectDetail>(`/projects/${id}`).then((res) => res.data),

  select: () =>
    api
      .get<Pick<Project, 'id' | 'projectName'>[]>('/projects/select')
      .then((res) => res.data),

  create: (payload: Record<string, unknown>) =>
    api.post<Project>('/projects', payload).then((res) => res.data),

  update: (id: number, payload: Record<string, unknown>) =>
    api.patch<Project>(`/projects/${id}`, payload).then((res) => res.data),

  remove: (id: number) => api.delete(`/projects/${id}`).then((res) => res.data),
};

export interface TaskQuery extends ListQuery {
  status?: string;
  priority?: string;
  projectId?: number | string;
  assignedUser?: number | string;
}

export const tasksApi = {
  list: (params: TaskQuery) =>
    api.get<Paginated<Task>>('/tasks', { params: cleanParams(params) }).then((res) => res.data),

  detail: (id: number) => api.get<Task>(`/tasks/${id}`).then((res) => res.data),

  create: (payload: Record<string, unknown>) =>
    api.post<Task>('/tasks', payload).then((res) => res.data),

  update: (id: number, payload: Record<string, unknown>) =>
    api.patch<Task>(`/tasks/${id}`, payload).then((res) => res.data),

  remove: (id: number) => api.delete(`/tasks/${id}`).then((res) => res.data),
};

export const dashboardApi = {
  stats: () => api.get<DashboardStats>('/dashboard/stats').then((res) => res.data),
};
