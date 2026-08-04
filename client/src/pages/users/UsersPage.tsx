import { usersApi } from '@/api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, type Column } from '@/components/common/DataTable';
import { DetailDialog, DetailRow } from '@/components/common/DetailDialog';
import { FilterSelect } from '@/components/common/FilterSelect';
import { PageCard } from '@/components/common/PageCard';
import { RowActions } from '@/components/common/RowActions';
import { StatusChip } from '@/components/common/StatusChip';
import { TableFooter } from '@/components/common/TableFooter';
import { TableToolbar } from '@/components/common/TableToolbar';
import { ROLE_LABEL, ROLE_OPTIONS } from '@/constants/status';
import { useListControls } from '@/hooks/use-list-controls';
import { getErrorMessage } from '@/lib/axios';
import { formatDate } from '@/lib/format';
import type { User } from '@/types';
import { Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { UserFormDialog } from './UserFormDialog';

export function UsersPage() {
  const queryClient = useQueryClient();
  const { page, setPage, search, setSearch, filters, setFilter, query } = useListControls({
    role: '',
  });

  const [detail, setDetail] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', query],
    queryFn: () => usersApi.list(query),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-assignable'] });
      toast.success("Foydalanuvchi o'chirildi");
      setDeleting(null);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns: Column<User>[] = [
    {
      key: 'index',
      header: '#',
      width: 56,
      render: (_row, index) => (data ? (data.meta.page - 1) * data.meta.limit + index + 1 : index + 1),
    },
    {
      key: 'fullname',
      header: "To'liq ism",
      render: (row) => <Typography variant="body2">{row.fullname}</Typography>,
    },
    { key: 'email', header: 'Email', render: (row) => row.email },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <StatusChip
          label={ROLE_LABEL[row.role]}
          tone={row.role === 'ADMIN' ? 'success' : 'neutral'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Sana',
      hideBelow: 'sm',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: 'Amallar',
      align: 'right',
      width: 130,
      render: (row) => (
        <RowActions
          onView={() => setDetail(row)}
          onEdit={() => { setEditing(row); setFormOpen(true); }}
          onDelete={() => setDeleting(row)}
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
              value={filters.role}
              onChange={(value) => setFilter('role', value)}
              options={ROLE_OPTIONS}
              allLabel="Barcha rollar"
              minWidth={150}
            />
          }
          actionLabel="Foydalanuvchi qo'shish"
          onAction={() => { setEditing(null); setFormOpen(true); }}
        />

        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="Foydalanuvchilar topilmadi"
        />

        <TableFooter meta={data?.meta} page={page} onPageChange={setPage} />
      </PageCard>

      <UserFormDialog open={formOpen} user={editing} onClose={() => setFormOpen(false)} />

      <DetailDialog
        open={detail !== null}
        title="Foydalanuvchi ma'lumotlari"
        onClose={() => setDetail(null)}
      >
        {detail && (
          <>
            <DetailRow label="To'liq ism">{detail.fullname}</DetailRow>
            <DetailRow label="Email">{detail.email}</DetailRow>
            <DetailRow label="Role">{ROLE_LABEL[detail.role]}</DetailRow>
            <DetailRow label="Sana">{formatDate(detail.createdAt)}</DetailRow>
          </>
        )}
      </DetailDialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Foydalanuvchini o'chirish"
        message={`"${deleting?.fullname}" foydalanuvchisini o'chirmoqchimisiz?`}
        isLoading={removeMutation.isPending}
        onConfirm={() => deleting && removeMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
