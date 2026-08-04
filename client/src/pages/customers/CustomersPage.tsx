import { customersApi } from '@/api';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { DataTable, type Column } from '@/components/common/DataTable';
import { PageCard } from '@/components/common/PageCard';
import { RowActions } from '@/components/common/RowActions';
import { TableFooter } from '@/components/common/TableFooter';
import { TableToolbar } from '@/components/common/TableToolbar';
import { useAuth } from '@/hooks/use-auth';
import { useListControls } from '@/hooks/use-list-controls';
import { getErrorMessage } from '@/lib/axios';
import { formatDate } from '@/lib/format';
import type { Customer } from '@/types';
import { Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CustomerDetailDialog } from './CustomerDetailDialog';
import { CustomerFormDialog } from './CustomerFormDialog';

export function CustomersPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { page, setPage, search, setSearch, query } = useListControls({});

  const [detailId, setDetailId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['customers', query],
    queryFn: () => customersApi.list(query),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => customersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Mijoz o'chirildi");
      setDeleting(null);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setFormOpen(true);
  };

  const columns: Column<Customer>[] = [
    {
      key: 'index',
      header: '#',
      width: 56,
      render: (_row, index) =>
        data ? (data.meta.page - 1) * data.meta.limit + index + 1 : index + 1,
    },
    {
      key: 'companyName',
      header: 'Company',
      render: (row) => <Typography variant="body2">{row.companyName}</Typography>,
    },
    { key: 'fullname', header: "To'liq ism", render: (row) => row.fullname },
    { key: 'email', header: 'Email', hideBelow: 'md', render: (row) => row.email },
    { key: 'phone', header: 'Telefon', hideBelow: 'sm', render: (row) => row.phone },
    { key: 'address', header: 'Manzil', hideBelow: 'lg', render: (row) => row.address },
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
          onEdit={isAdmin ? () => openEdit(row) : undefined}
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
          actionLabel={isAdmin ? 'Yangi customer' : undefined}
          onAction={isAdmin ? openCreate : undefined}
        />

        <DataTable
          columns={columns}
          rows={data?.data ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="Mijozlar topilmadi"
        />

        <TableFooter meta={data?.meta} page={page} onPageChange={setPage} />
      </PageCard>

      <CustomerFormDialog open={formOpen} customer={editing} onClose={() => setFormOpen(false)} />

      <CustomerDetailDialog customerId={detailId} onClose={() => setDetailId(null)} />

      <ConfirmDialog
        open={deleting !== null}
        title="Mijozni o'chirish"
        message={`"${deleting?.companyName}" mijozini o'chirmoqchimisiz? Uning barcha loyihalari ham o'chiriladi.`}
        isLoading={removeMutation.isPending}
        onConfirm={() => deleting && removeMutation.mutate(deleting.id)}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
