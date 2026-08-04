import { authApi } from '@/api';
import { RHFTextField } from '@/components/form/RHFTextField';
import { useAuth } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from './AuthLayout';

const schema = z.object({
  email: z.string().min(1, 'Email kiriting').email("Email formati noto'g'ri"),
  password: z.string().min(6, 'Parol kamida 6 belgidan iborat bo\'lishi kerak'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      signIn(data);
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
            <RHFTextField
              name="password"
              control={control}
              type={showPassword ? 'text' : 'password'}
              placeholder="Parolni kiriting"
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword((current) => !current)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlinedIcon fontSize="small" />
                        ) : (
                          <VisibilityOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox defaultChecked size="small" />}
              label={<Typography variant="body2">Eslab qolish</Typography>}
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
