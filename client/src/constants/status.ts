import type { ProjectStatus, Role, TaskPriority, TaskStatus } from '@/types';

export type ChipTone = 'success' | 'warning' | 'neutral' | 'danger';

interface ChipMeta {
  label: string;
  tone: ChipTone;
}

export const PROJECT_STATUS: Record<ProjectStatus, ChipMeta> = {
  COMPLETED: { label: 'Tugallangan', tone: 'success' },
  IN_PROGRESS: { label: 'Jarayonda', tone: 'warning' },
  PENDING: { label: 'Kutilmoqda', tone: 'neutral' },
  CANCELLED: { label: 'Bekor qilingan', tone: 'danger' },
};

export const TASK_STATUS: Record<TaskStatus, ChipMeta> = {
  COMPLETED: { label: 'Tugallangan', tone: 'success' },
  IN_PROGRESS: { label: 'Jarayonda', tone: 'warning' },
  PENDING: { label: 'Kutilmoqda', tone: 'neutral' },
};

export const TASK_PRIORITY: Record<TaskPriority, ChipMeta> = {
  HIGH: { label: 'Yuqori', tone: 'danger' },
  MEDIUM: { label: "O'rta", tone: 'warning' },
  LOW: { label: 'Past', tone: 'neutral' },
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Admin',
  USER: 'User',
};

export const PROJECT_STATUS_OPTIONS = (
  Object.keys(PROJECT_STATUS) as ProjectStatus[]
).map((value) => ({ value, label: PROJECT_STATUS[value].label }));

export const TASK_STATUS_OPTIONS = (Object.keys(TASK_STATUS) as TaskStatus[]).map((value) => ({
  value,
  label: TASK_STATUS[value].label,
}));

export const TASK_PRIORITY_OPTIONS = (
  Object.keys(TASK_PRIORITY) as TaskPriority[]
).map((value) => ({ value, label: TASK_PRIORITY[value].label }));

export const ROLE_OPTIONS = (Object.keys(ROLE_LABEL) as Role[]).map((value) => ({
  value,
  label: ROLE_LABEL[value],
}));
