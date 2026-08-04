export type Role = 'ADMIN' | 'USER';
export type ProjectStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  companyName: string;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetail extends Customer {
  projects: Pick<Project, 'id' | 'projectName' | 'status' | 'deadline'>[];
  _count: { projects: number };
}

export interface Project {
  id: number;
  customerId: number;
  projectName: string;
  description: string | null;
  status: ProjectStatus;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  customer: Pick<Customer, 'id' | 'companyName' | 'fullname'>;
  _count: { tasks: number };
}

export interface ProjectDetail extends Project {
  tasks: Pick<Task, 'id' | 'title' | 'status' | 'priority' | 'deadline'>[];
}

export interface Task {
  id: number;
  projectId: number;
  assignedUser: number | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  project: Pick<Project, 'id' | 'projectName'>;
  assignee: Pick<User, 'id' | 'fullname' | 'email'> | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface DashboardStats {
  totalCustomers: number;
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  projectStats: { status: ProjectStatus; count: number }[];
  taskTrend: { month: string; count: number }[];
  recentTasks: {
    id: number;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    deadline: string | null;
    createdAt: string;
    project: { id: number; projectName: string };
    assignee: { id: number; fullname: string } | null;
  }[];
}

export interface SelectOption {
  value: number | string;
  label: string;
}
