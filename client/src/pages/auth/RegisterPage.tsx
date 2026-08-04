import { authApi } from '@/api';
import { RHFPasswordField } from '@/components/form/RHFPasswordField';
import { RHFTextField } from '@/components/form/RHFTextField';
import { useAuth } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from './AuthLayout';

const schema = z
  .object({
    fullname: z.string().min(3, "To'liq ism kamida 3 belgidan iborat bo'lishi kerak"),
    email: z.string().min(1, 'Email kiriting').email("Email formati noto'g'ri"),
    password: z
      .string()
      .min(6, "Parol kamida 6 belgidan iborat bo'lishi kerak")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).+$/,
        "Parolda kamida bitta harf va bitta raqam bo'lishi kerak",
      ),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Parollar mos kelmadi',
  });

type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { fullname: '', email: '', password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (values: RegisterForm) =>
      authApi.register({
        fullname: values.fullname,
        email: values.email,
        password: values.password,
      }),
    onSuccess: (data) => {
      // Ro'yxatdan o'tishda "eslab qolish" yo'q — sessiya brauzer yopilguncha.
      signIn(data, false);
      toast.success("Ro'yxatdan o'tdingiz!");
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Ro'yxatdan o'tishda xatolik")),
  });

  return (
    <AuthLayout title="Register" subtitle="Yangi hisob yarating">
      <Box component="form" onSubmit={handleSubmit((values) => mutation.mutate(values))} noValidate>
        <Stack spacing={2}>
          <Stack spacing={0.75}>
            <Typography variant="body2" fontWeight={500}>
              To'liq ism
            </Typography>
            <RHFTextField name="fullname" control={control} placeholder="John Doe" autoFocus />
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="body2" fontWeight={500}>
              Email
            </Typography>
            <RHFTextField
              name="email"
              control={control}
              type="email"
              placeholder="email@example.com"
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
              autoComplete="new-password"
            />
          </Stack>

          <Stack spacing={0.75}>
            <Typography variant="body2" fontWeight={500}>
              Parolni tasdiqlang
            </Typography>
            <RHFPasswordField
              name="confirmPassword"
              control={control}
              placeholder="Parolni qayta kiriting"
              autoComplete="new-password"
            />
          </Stack>

          <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
            {mutation.isPending ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
          </Button>

          <Typography variant="body2" align="center" color="text.secondary">
            Hisobingiz bormi?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Kirish
            </Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
