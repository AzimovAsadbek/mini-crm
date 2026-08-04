import { usersApi } from '@/api';
import { FormDialog } from '@/components/common/FormDialog';
import { RHFSelect } from '@/components/form/RHFSelect';
import { RHFTextField } from '@/components/form/RHFTextField';
import { ROLE_OPTIONS } from '@/constants/status';
import { getErrorMessage } from '@/lib/axios';
import type { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const passwordRule = z
  .string()
  .min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak")
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Parolda kamida bitta harf va bitta raqam bo'lishi kerak");

function buildSchema(isEdit: boolean) {
  return z.object({
    fullname: z.string().min(3, "To'liq ism kamida 3 belgi"),
    email: z.string().min(1, 'Email kiriting').email("Email formati noto'g'ri"),
    // Tahrirlashda parol bo'sh qolsa o'zgarmaydi.
    password: isEdit ? z.union([z.literal(''), passwordRule]) : passwordRule,
    role: z.enum(['ADMIN', 'USER']),
  });
}

type UserForm = z.infer<ReturnType<typeof buildSchema>>;

const EMPTY: UserForm = { fullname: '', email: '', password: '', role: 'USER' };

interface UserFormDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

export function UserFormDialog({ open, user, onClose }: UserFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = user !== null;

  const { control, handleSubmit, reset } = useForm<UserForm>({
    resolver: zodResolver(buildSchema(isEdit)),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        user
          ? { fullname: user.fullname, email: user.email, password: '', role: user.role }
          : EMPTY,
      );
    }
  }, [open, user, reset]);

  const mutation = useMutation({
    mutationFn: (values: UserForm) => {
      const payload: Record<string, unknown> = {
        fullname: values.fullname,
        email: values.email,
        role: values.role,
      };

      if (values.password) {
        payload.password = values.password;
      }

      return user ? usersApi.update(user.id, payload) : usersApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-assignable'] });
      toast.success(user ? 'Foydalanuvchi yangilandi' : "Foydalanuvchi qo'shildi");
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <FormDialog
      open={open}
      title={user ? 'Foydalanuvchini tahrirlash' : "Foydalanuvchi qo'shish"}
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      onClose={onClose}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <RHFTextField name="fullname" control={control} label="To'liq ism" />
        <RHFTextField name="email" control={control} label="Email" type="email" />
        <RHFTextField
          name="password"
          control={control}
          label={user ? "Yangi parol (ixtiyoriy)" : 'Parol'}
          type="password"
        />
        <RHFSelect name="role" control={control} label="Role" options={ROLE_OPTIONS} />
      </Stack>
    </FormDialog>
  );
}
