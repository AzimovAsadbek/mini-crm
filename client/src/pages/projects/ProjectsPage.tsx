import { projectsApi } from '@/api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, type Column } from '@/components/common/DataTable';
import { FilterSelect } from '@/components/common/FilterSelect';
import { PageCard } from '@/components/common/PageCard';
import { RowActions } from '@/components/common/RowActions';
import { StatusChip } from '@/components/common/StatusChip';
import { TableFooter } from '@/components/common/TableFooter';
import { TableToolbar } from '@/components/common/TableToolbar';
import { PROJECT_STATUS, PROJECT_STATUS_OPTIONS } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { useListControls } from '@/hooks/use-list-controls';
import { getErrorMessage } from '@/lib/axios';
import { formatDate } from '@/lib/format';
import type { Project } from '@/types';
import { Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ProjectDetailDialog } from './ProjectDetailDialog';
import { ProjectFormDialog } from './ProjectFormDialog';

export function ProjectsPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { page, setPage, search, setSearch, filters, setFilter, query } = useListControls({
    status: '',
  });

  const [detailId, setDetailId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', query],
    queryFn: () => projectsApi.list(query),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => projectsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Loyiha o'chirildi");
      setDeleting(null);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const columns: Column<Project>[] = [
    {
      key: 'index',
      header: '#',
      width: 56,
      render: (_row, index) =>
        data ? (data.meta.page - 1) * data.meta.limit + index + 1 : index + 1,
    },
    {
      key: 'projectName',
      header: 'Loyiha nomi',
      render: (row) => <Typography variant="body2">{row.projectName}</Typography>,
    },
    { key: 'customer', header: 'Customer', render: (row) => row.customer.companyName },
    {
      key: 'status',
      header: 'Holat',
      render: (row) => (
        <StatusChip
          label={PROJECT_STATUS[row.status].label}
          tone={PROJECT_STATUS[row.status].tone}
        />
      ),
    },
    {
      key: 'deadline',
      header: 'Deadline',
      hideBelow: 'md',
      render: (row) => formatDate(row.deadline),
    },
    {
      key: 'createdAt',
      header: 'Sana',
      hideBelow: 'lg',
      render: (row) => formatDate(row.createdAt),
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
            isAdmin
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
            <FilterSelect
              value={filters.status}
              onChange={(value) => setFilter('status', value)}
              options={PROJECT_STATUS_OPTIONS}
              allLabel="Barcha holatlar"
            />
          }
          actionLabel={isAdmin ? 'Yangi loyiha' : undefined}
          onAction={isAdmin ? openCreate : undefined}
        />

        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="Loyihalar topilmadi"
        />

        <TableFooter meta={data?.meta} page={page} onPageChange={setPage} />
      </PageCard>

      <ProjectFormDialog open={formOpen} project={editing} onClose={() => setFormOpen(false)} />

      <ProjectDetailDialog projectId={detailId} onClose={() => setDetailId(null)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Loyihani o'chirish"
        message={`"${deleting?.projectName}" loyihasini o'chirmoqchimisiz? Uning barcha vazifalari ham o'chiriladi.`}
        isLoading={removeMutation.isPending}
        onConfirm={() => deleting && removeMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
