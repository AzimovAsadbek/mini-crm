import { authApi } from '@/api';
import { RHFPasswordField } from '@/components/form/RHFPasswordField';
import { RHFTextField } from '@/components/form/RHFTextField';
import { useAuth } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, FormControlLabel, Link, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from './AuthLayout';

const schema = z.object({
  email: z.string().min(1, 'Email kiriting').email("Email formati noto'g'ri"),
  password: z.string().min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak"),
  /** Belgilansa sessiya 7 kun saqlanadi, aks holda brauzer yopilguncha. */
  remember: z.boolean(),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const mutation = useMutation({
    mutationFn: ({ remember: _remember, ...credentials }: LoginForm) => authApi.login(credentials),
    onSuccess: (data, variables) => {
      signIn(data, variables.remember);
      toast.success(`Xush kelibsiz, ${data.user.fullname}!`);

      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? '/dashboard', { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Kirishda xatolik')),
  });

  return (
    <AuthLayout title="Login" subtitle="Hisobingizga kiring">
      <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
        <Stack spacing={2}>
          <Stack spacing={0.75}>
            <Typography variant="body2" fontWeight={500}>
              Email
            </Typography>
            <RHFTextField
              name="email"
              control={control}
              type="email"
              placeholder="email@example.com"
              autoComplete="email"
              autoFocus
            />
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="body2" fontWeight={500}>
              Parol
            </Typography>
            <RHFPasswordField
              name="password"
              control={control}
              placeholder="Parolni kiriting"
              autoComplete="current-password"
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  }
                  label={<Typography variant="body2">Eslab qolish</Typography>}
                />
              )}
            />
            <Link component="button" type="button" variant="body2" underline="hover">
              Parolni unutdingizmi?
            </Link>
          </Stack>

          <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
            {mutation.isPending ? 'Kirilmoqda...' : 'Kirish'}
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            Hisobingiz yo'qmi?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              Ro'yxatdan o'ting
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
