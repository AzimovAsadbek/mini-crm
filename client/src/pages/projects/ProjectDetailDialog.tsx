import { projectsApi } from '@/api';
import { DetailDialog, DetailRow } from '@/components/common/DetailDialog';
import { StatusChip } from '@/components/common/StatusChip';
import { PROJECT_STATUS, TASK_STATUS } from '@/constants/status';
import { formatDate } from '@/lib/format';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface ProjectDetailDialogProps {
  projectId: number | null;
  onClose: () => void;
}

export function ProjectDetailDialog({ projectId, onClose }: ProjectDetailDialogProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.detail(projectId as number),
    enabled: projectId !== null,
  });

  return (
    <DetailDialog open={projectId !== null} title="Loyiha ma'lumotlari" onClose={onClose}>
      {isLoading && <Skeleton variant="rounded" height={220} />}

      {data && (
        <>
          <DetailRow label="Loyiha nomi">{data.projectName}</DetailRow>
          <DetailRow label="Customer">{data.customer.companyName}</DetailRow>
          <DetailRow label="Holat">
            <StatusChip
              label={PROJECT_STATUS[data.status].label}
              tone={PROJECT_STATUS[data.status].tone}
            />
          </DetailRow>
          <DetailRow label="Deadline">{formatDate(data.deadline)}</DetailRow>
          <DetailRow label="Sana">{formatDate(data.createdAt)}</DetailRow>
          <DetailRow label="Tavsif">{data.description || '—'}</DetailRow>
          <DetailRow label="Vazifalar">{data._count.tasks} ta</DetailRow>

          {data.tasks.length > 0 && (
            <Stack spacing={1} sx={{ pt: 0.5 }}>
              {data.tasks.slice(0, 8).map((task) => (
                <Stack
                  key={task.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography variant="body2">{task.title}</Typography>
                  <StatusChip
                    label={TASK_STATUS[task.status].label}
                    tone={TASK_STATUS[task.status].tone}
                  />
                </Stack>
              ))}
            </Stack>
          )}
        </>
      )}
    </DetailDialog>
  );
}
