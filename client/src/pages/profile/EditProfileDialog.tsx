import { usersApi } from '@/api';
import { FormDialog } from '@/components/common/FormDialog';
import { RHFTextField } from '@/components/form/RHFTextField';
import { useAuth } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  fullname: z.string().min(3, "To'liq ism kamida 3 belgi"),
  email: z.string().min(1, 'Email kiriting').email("Email formati noto'g'ri"),
});

type ProfileForm = z.infer<typeof schema>;

export function EditProfileDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: { fullname: '', email: '' },
  });

  useEffect(() => {
    if (open && user) {
      reset({ fullname: user.fullname, email: user.email });
    }
  }, [open, user, reset]);

  const mutation = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (updated) => {
      setUser(updated);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Ma'lumotlar yangilandi");
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <FormDialog
      open={open}
      title="Ma'lumotni tahrirlash"
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      onClose={onClose}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <RHFTextField name="fullname" control={control} label="To'liq ism" />
        <RHFTextField name="email" control={control} label="Email" type="email" />
      </Stack>
    </FormDialog>
  );
}
