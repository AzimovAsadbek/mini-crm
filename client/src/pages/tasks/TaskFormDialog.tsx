import { projectsApi, tasksApi, usersApi } from '@/api';
import { FormDialog } from '@/components/common/FormDialog';
import { RHFSelect } from '@/components/form/RHFSelect';
import { RHFTextField } from '@/components/form/RHFTextField';
import { TASK_PRIORITY_OPTIONS, TASK_STATUS_OPTIONS } from '@/constants/status';
import { useAuth } from '@/hooks/use-auth';
import { getErrorMessage } from '@/lib/axios';
import { toDateInputValue } from '@/lib/format';
import type { Task } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(2, 'Vazifa nomi kamida 2 belgi'),
  projectId: z.union([z.string(), z.number()]).refine((value) => value !== '', 'Loyihani tanlang'),
  assignedUser: z.union([z.string(), z.number()]),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  deadline: z.string(),
  description: z.string(),
});

type TaskForm = z.infer<typeof schema>;

const EMPTY: TaskForm = {
  title: '',
  projectId: '',
  assignedUser: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  deadline: '',
  description: '',
};

interface TaskFormDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
}

export function TaskFormDialog({ open, task, onClose }: TaskFormDialogProps) {
  const queryClient = useQueryClient();
  const { isAdmin } = useAuth();

  // Oddiy USER faqat o'ziga biriktirilgan vazifaning holatini o'zgartira oladi.
  const statusOnly = !isAdmin;

  const { data: projects = [] } = useQuery({
    queryKey: ['projects-select'],
    queryFn: projectsApi.select,
    enabled: open,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users-assignable'],
    queryFn: usersApi.assignable,
    enabled: open,
  });

  const { control, handleSubmit, reset } = useForm<TaskForm>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        task
          ? {
              title: task.title,
              projectId: task.projectId,
              assignedUser: task.assignedUser ?? '',
              status: task.status,
              priority: task.priority,
              deadline: toDateInputValue(task.deadline),
              description: task.description ?? '',
            }
          : EMPTY,
      );
    }
  }, [open, task, reset]);

  const mutation = useMutation({
    mutationFn: (values: TaskForm) => {
      if (task && statusOnly) {
        return tasksApi.update(task.id, { status: values.status });
      }

      const payload = {
        title: values.title,
        projectId: Number(values.projectId),
        assignedUser: values.assignedUser === '' ? null : Number(values.assignedUser),
        status: values.status,
        priority: values.priority,
        deadline: values.deadline || null,
        description: values.description || null,
      };

      return task ? tasksApi.update(task.id, payload) : tasksApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(task ? 'Vazifa yangilandi' : "Vazifa qo'shildi");
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <FormDialog
      open={open}
      title={task ? 'Vazifani tahrirlash' : 'Yangi vazifa'}
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      onClose={onClose}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <RHFTextField name="title" control={control} label="Vazifa nomi" disabled={statusOnly} />

        <RHFSelect
          name="projectId"
          control={control}
          label="Loyiha"
          emptyLabel="Loyihani tanlang"
          disabled={statusOnly}
          options={projects.map((project) => ({
            value: project.id,
            label: project.projectName,
          }))}
        />

        <RHFSelect
          name="assignedUser"
          control={control}
          label="Mas'ul"
          emptyLabel="Biriktirilmagan"
          disabled={statusOnly}
          options={users.map((user) => ({ value: user.id, label: user.fullname }))}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFSelect name="status" control={control} label="Holat" options={TASK_STATUS_OPTIONS} />
          <RHFSelect
            name="priority"
            control={control}
            label="Priority"
            disabled={statusOnly}
            options={TASK_PRIORITY_OPTIONS}
          />
        </Stack>

        <RHFTextField
          name="deadline"
          control={control}
          label="Deadline"
          type="date"
          disabled={statusOnly}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <RHFTextField
          name="description"
          control={control}
          label="Tavsif"
          multiline
          minRows={3}
          disabled={statusOnly}
        />
      </Stack>
    </FormDialog>
  );
}
