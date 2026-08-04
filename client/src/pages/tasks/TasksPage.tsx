import { projectsApi, tasksApi } from '@/api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, type Column } from '@/components/common/DataTable';
import { FilterSelect } from '@/components/common/FilterSelect';
import { PageCard } from '@/components/common/PageCard';
import { RowActions } from '@/components/common/RowActions';
import { StatusChip } from '@/components/common/StatusChip';
import { TableFooter } from '@/components/common/TableFooter';
import { TableToolbar } from '@/components/common/TableToolbar';
import { TASK_PRIORITY, TASK_STATUS, TASK_STATUS_OPTIONS } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { useListControls } from '@/hooks/use-list-controls';
import { getErrorMessage } from '@/lib/axios';
import { formatDate } from '@/lib/format';
import type { Task } from '@/types';
import { Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { TaskDetailDialog } from './TaskDetailDialog';
import { TaskFormDialog } from './TaskFormDialog';

export function TasksPage() {
  const { isAdmin, user } = useAuth();
  const queryClient = useQueryClient();
  const { page, setPage, search, setSearch, filters, setFilter, query } = useListControls({
    projectId: '',
    status: '',
  });

  const [detailId, setDetailId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', query],
    queryFn: () => tasksApi.list(query),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-select'],
    queryFn: projectsApi.select,
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => tasksApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Vazifa o'chirildi");
      setDeleting(null);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  // USER faqat o'ziga biriktirilgan vazifani tahrirlay oladi (backend ham shuni tekshiradi).
  const canEdit = (task: Task) => isAdmin || task.assignedUser === user?.id;

  const columns: Column<Task>[] = [
    {
      key: 'index',
      header: '#',
      width: 56,
      render: (_row, index) =>
        data ? (data.meta.page - 1) * data.meta.limit + index + 1 : index + 1,
    },
    {
      key: 'title',
      header: 'Vazifa nomi',
      render: (row) => <Typography variant="body2">{row.title}</Typography>,
    },
    { key: 'project', header: 'Loyiha', render: (row) => row.project.projectName },
    {
      key: 'assignee',
      header: "Mas'ul",
      hideBelow: 'md',
      render: (row) => row.assignee?.fullname ?? '—',
    },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => (
        <StatusChip label={TASK_STATUS[row.status].label} tone={TASK_STATUS[row.status].tone} />
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      hideBelow: 'sm',
      render: (row) => (
        <StatusChip
          label={TASK_PRIORITY[row.priority].label}
          tone={TASK_PRIORITY[row.priority].tone}
        />
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      hideBelow: 'lg',
      render: (row) => formatDate(row.deadline),
    },
    {
      key: 'actions',
      header: 'Amallar',
      align: 'right',
      width: 130,
      render: (row) => (
        <RowActions
          onView={() => setDetailId(row.id)}
          onEdit={
            canEdit(row)
              ? () => {
                  setEditing(row);
                  setFormOpen(true);
                }
              : undefined
          }
          onDelete={isAdmin ? () => setDeleting(row) : undefined}
        />
      ),
    },
  ];

  return (
    <>
      <PageCard>
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          filters={
            <>
              <FilterSelect
                value={filters.projectId}
                onChange={(value) => setFilter('projectId', value)}
                options={projects.map((project) => ({
                  value: project.id,
                  label: project.projectName,
                }))}
                allLabel="Barcha loyihalar"
              />
              <FilterSelect
                value={filters.status}
                onChange={(value) => setFilter('status', value)}
                options={TASK_STATUS_OPTIONS}
                allLabel="Barcha holatlar"
              />
            </>
          }
          actionLabel={isAdmin ? 'Yangi vazifa' : undefined}
          onAction={
            isAdmin
              ? () => {
                  setEditing(null);
                  setFormOpen(true);
                }
              : undefined
          }
        />

        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="Vazifalar topilmadi"
        />

        <TableFooter meta={data?.meta} page={page} onPageChange={setPage} />
      </PageCard>

      <TaskFormDialog open={formOpen} task={editing} onClose={() => setFormOpen(false)} />

      <TaskDetailDialog taskId={detailId} onClose={() => setDetailId(null)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Vazifani o'chirish"
        message={`"${deleting?.title}" vazifasini o'chirmoqchimisiz?`}
        isLoading={removeMutation.isPending}
        onConfirm={() => deleting && removeMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
