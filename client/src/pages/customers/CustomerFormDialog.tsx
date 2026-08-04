import { customersApi } from '@/api';
import { FormDialog } from '@/components/common/FormDialog';
import { RHFTextField } from '@/components/form/RHFTextField';
import { getErrorMessage } from '@/lib/axios';
import type { Customer } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  companyName: z.string().min(2, 'Kompaniya nomi kamida 2 belgi'),
  fullname: z.string().min(3, "To'liq ism kamida 3 belgi"),
  phone: z.string().regex(/^\+?\d[\d\s-]{6,20}$/, "Telefon raqami noto'g'ri formatda"),
  email: z.string().min(1, 'Email kiriting').email("Email formati noto'g'ri"),
  address: z.string().min(2, 'Manzil kamida 2 belgi'),
});

type CustomerForm = z.infer<typeof schema>;

const EMPTY: CustomerForm = {
  companyName: '',
  fullname: '',
  phone: '',
  email: '',
  address: '',
};

interface CustomerFormDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export function CustomerFormDialog({ open, customer, onClose }: CustomerFormDialogProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<CustomerForm>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? {
              companyName: customer.companyName,
              fullname: customer.fullname,
              phone: customer.phone,
              email: customer.email,
              address: customer.address,
            }
          : EMPTY,
      );
    }
  }, [open, customer, reset]);

  const mutation = useMutation({
    mutationFn: (values: CustomerForm) =>
      customer ? customersApi.update(customer.id, values) : customersApi.create(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(customer ? 'Mijoz yangilandi' : "Mijoz qo'shildi");
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <FormDialog
      open={open}
      title={customer ? 'Mijozni tahrirlash' : 'Yangi customer'}
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      onClose={onClose}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <RHFTextField name="companyName" control={control} label="Kompaniya nomi" />
        <RHFTextField name="fullname" control={control} label="To'liq ism" />
        <RHFTextField name="phone" control={control} label="Telefon" placeholder="+998901234567" />
        <RHFTextField name="email" control={control} label="Email" type="email" />
        <RHFTextField name="address" control={control} label="Manzil" />
      </Stack>
    </FormDialog>
  );
}
