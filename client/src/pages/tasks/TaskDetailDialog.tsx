import { tasksApi } from '@/api';
import { DetailDialog, DetailRow } from '@/components/common/DetailDialog';
import { StatusChip } from '@/components/common/StatusChip';
import { TASK_PRIORITY, TASK_STATUS } from '@/constants/status';
import { formatDate } from '@/lib/format';
import { Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface TaskDetailDialogProps {
  taskId: number | null;
  onClose: () => void;
}

export function TaskDetailDialog({ taskId, onClose }: TaskDetailDialogProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.detail(taskId as number),
    enabled: taskId !== null,
  });

  return (
    <DetailDialog open={taskId !== null} title="Vazifa ma'lumotlari" onClose={onClose}>
      {isLoading && <Skeleton variant="rounded" height={220} />}

      {data && (
        <>
          <DetailRow label="Vazifa nomi">{data.title}</DetailRow>
          <DetailRow label="Loyiha">{data.project.projectName}</DetailRow>
          <DetailRow label="Mas'ul">{data.assignee?.fullname ?? '—'}</DetailRow>
          <DetailRow label="Holat">
            <StatusChip
              label={TASK_STATUS[data.status].label}
              tone={TASK_STATUS[data.status].tone}
            />
          </DetailRow>
          <DetailRow label="Priority">
            <StatusChip
              label={TASK_PRIORITY[data.priority].label}
              tone={TASK_PRIORITY[data.priority].tone}
            />
          </DetailRow>
          <DetailRow label="Deadline">{formatDate(data.deadline)}</DetailRow>
          <DetailRow label="Sana">{formatDate(data.createdAt)}</DetailRow>
          <DetailRow label="Tavsif">{data.description || '—'}</DetailRow>
        </>
      )}
    </DetailDialog>
  );
}
