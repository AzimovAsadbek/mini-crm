import { customersApi, projectsApi } from '@/api';
import { FormDialog } from '@/components/common/FormDialog';
import { RHFSelect } from '@/components/form/RHFSelect';
import { RHFTextField } from '@/components/form/RHFTextField';
import { PROJECT_STATUS_OPTIONS } from '@/constants/status';
import { getErrorMessage } from '@/lib/axios';
import { toDateInputValue } from '@/lib/format';
import type { Project } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const schema = z.object({
  projectName: z.string().min(2, 'Loyiha nomi kamida 2 belgi'),
  customerId: z.union([z.string(), z.number()]).refine((value) => value !== '', 'Mijozni tanlang'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
  deadline: z.string(),
  description: z.string(),
});

type ProjectForm = z.infer<typeof schema>;

const EMPTY: ProjectForm = {
  projectName: '',
  customerId: '',
  status: 'PENDING',
  deadline: '',
  description: '',
};

interface ProjectFormDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

export function ProjectFormDialog({ open, project, onClose }: ProjectFormDialogProps) {
  const queryClient = useQueryClient();

  const { data: customers = [] } = useQuery({
    queryKey: ['customers-select'],
    queryFn: customersApi.select,
    enabled: open,
  });

  const { control, handleSubmit, reset } = useForm<ProjectForm>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) {
      reset(
        project
          ? {
              projectName: project.projectName,
              customerId: project.customerId,
              status: project.status,
              deadline: toDateInputValue(project.deadline),
              description: project.description ?? '',
            }
          : EMPTY,
      );
    }
  }, [open, project, reset]);

  const mutation = useMutation({
    mutationFn: (values: ProjectForm) => {
      const payload = {
        projectName: values.projectName,
        customerId: Number(values.customerId),
        status: values.status,
        deadline: values.deadline || null,
        description: values.description || null,
      };

      return project ? projectsApi.update(project.id, payload) : projectsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(project ? 'Loyiha yangilandi' : "Loyiha qo'shildi");
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <FormDialog
      open={open}
      title={project ? 'Loyihani tahrirlash' : 'Yangi loyiha'}
      isSubmitting={mutation.isPending}
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      onClose={onClose}
    >
      <Stack spacing={2} sx={{ pt: 1 }}>
        <RHFTextField name="projectName" control={control} label="Loyiha nomi" />

        <RHFSelect
          name="customerId"
          control={control}
          label="Customer"
          emptyLabel="Mijozni tanlang"
          options={customers.map((customer) => ({
            value: customer.id,
            label: customer.companyName,
          }))}
        />

        <RHFSelect name="status" control={control} label="Holat" options={PROJECT_STATUS_OPTIONS} />

        <RHFTextField
          name="deadline"
          control={control}
          label="Deadline"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <RHFTextField name="description" control={control} label="Tavsif" multiline minRows={3} />
      </Stack>
    </FormDialog>
  );
}
