import { tasksApi } from '@/api';
import { daysUntil } from '@/lib/format';
import type { Task } from '@/types';
import { useQueries } from '@tanstack/react-query';
import { useAuth } from './use-auth';

const OPEN_STATUSES = 'PENDING,IN_PROGRESS';
const UPCOMING_LIMIT = 5;

/** Deadline holatiga qarab bildirishnoma rangi va matni. */
export type Urgency = 'overdue' | 'soon' | 'normal';

export function getUrgency(task: Task): Urgency {
  const days = daysUntil(task.deadline);

  if (days === null) {
    return 'normal';
  }

  if (days < 0) {
    return 'overdue';
  }

  return days <= 3 ? 'soon' : 'normal';
}

export interface MyTaskSummary {
  total: number;
  completed: number;
  open: number;
  overdue: number;
  upcoming: Task[];
  isLoading: boolean;
}

/**
 * Joriy foydalanuvchiga biriktirilgan vazifalar bo'yicha xulosa —
 * Profile statistikasi va topbar bildirishnomalari uchun umumiy manba.
 */
export function useMyTasks(): MyTaskSummary {
  const { user } = useAuth();
  const assignedUser = user?.id;
  const enabled = Boolean(assignedUser);

  const [totalQuery, completedQuery, openQuery] = useQueries({
    queries: [
      {
        queryKey: ['my-tasks', assignedUser, 'total'],
        queryFn: () => tasksApi.list({ assignedUser, limit: 1 }),
        enabled,
      },
      {
        queryKey: ['my-tasks', assignedUser, 'completed'],
        queryFn: () => tasksApi.list({ assignedUser, status: 'COMPLETED', limit: 1 }),
        enabled,
      },
      {
        queryKey: ['my-tasks', assignedUser, 'open'],
        queryFn: () =>
          tasksApi.list({
            assignedUser,
            status: OPEN_STATUSES,
            limit: UPCOMING_LIMIT,
            sortBy: 'deadline',
            sortOrder: 'asc',
          }),
        enabled,
      },
    ],
  });

  const upcoming = openQuery.data?.data ?? [];

  return {
    total: totalQuery.data?.meta.total ?? 0,
    completed: completedQuery.data?.meta.total ?? 0,
    open: openQuery.data?.meta.total ?? 0,
    overdue: upcoming.filter((task) => getUrgency(task) === 'overdue').length,
    upcoming,
    isLoading: totalQuery.isLoading || completedQuery.isLoading || openQuery.isLoading,
  };
}
