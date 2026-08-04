import { usersApi } from '@/api';
import { FormDialog } from '@/components/common/FormDialog';
import { RHFPasswordField } from '@/components/form/RHFPasswordField';
import { useAuth } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z
  .object({
    currentPassword: z.string().min(6, 'Joriy parolni kiriting'),
    newPassword: z
      .string()
      .min(6, "Yangi parol kamida 6 belgidan iborat bo'lishi kerak")
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Parolda kamida bitta harf va bitta raqam bo'lishi kerak"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Parollar mos kelmadi',
  });

type PasswordForm = z.infer<typeof schema>;

const EMPTY: PasswordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };

export function ChangePasswordDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm<PasswordForm>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(EMPTY);
    }
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (values: PasswordForm) =>
      usersApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    // Backend parol o'zgarganda barcha sessiyalarni bekor qiladi — qayta kirish kerak.
    onSuccess: async () => {
      toast.success("Parol o'zgartirildi. Qaytadan kiring.");
      onClose();
      await signOut();
      navigate('/login', { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <FormDialog
      open={open}
      title="Parolni o'zgartirish"
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      onClose={onClose}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <RHFPasswordField
          name="currentPassword"
          control={control}
          label="Joriy parol"
          autoComplete="current-password"
        />
        <RHFPasswordField
          name="newPassword"
          control={control}
          label="Yangi parol"
          autoComplete="new-password"
        />
        <RHFPasswordField
          name="confirmPassword"
          control={control}
          label="Yangi parolni tasdiqlang"
          autoComplete="new-password"
        />
      </Stack>
    </FormDialog>
  );
}
