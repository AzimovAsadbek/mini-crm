import { customersApi } from '@/api';
import { DetailDialog, DetailRow } from '@/components/common/DetailDialog';
import { StatusChip } from '@/components/common/StatusChip';
import { PROJECT_STATUS } from '@/constants/status';
import { formatDate } from '@/lib/format';
import { Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

interface CustomerDetailDialogProps {
  customerId: number | null;
  onClose: () => void;
}

export function CustomerDetailDialog({ customerId, onClose }: CustomerDetailDialogProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => customersApi.detail(customerId as number),
    enabled: customerId !== null,
  });

  return (
    <DetailDialog open={customerId !== null} title="Mijoz ma'lumotlari" onClose={onClose}>
      {isLoading && <Skeleton variant="rounded" height={220} />}

      {data && (
        <>
          <DetailRow label="Kompaniya">{data.companyName}</DetailRow>
          <DetailRow label="To'liq ism">{data.fullname}</DetailRow>
          <DetailRow label="Email">{data.email}</DetailRow>
          <DetailRow label="Telefon">{data.phone}</DetailRow>
          <DetailRow label="Manzil">{data.address}</DetailRow>
          <DetailRow label="Sana">{formatDate(data.createdAt)}</DetailRow>
          <DetailRow label="Loyihalar">{data._count.projects} ta</DetailRow>

          {data.projects.length > 0 && (
            <Stack spacing={1} sx={{ pt: 0.5 }}>
              {data.projects.map((project) => (
                <Stack
                  key={project.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography variant="body2">{project.projectName}</Typography>
                  <StatusChip
                    label={PROJECT_STATUS[project.status].label}
                    tone={PROJECT_STATUS[project.status].tone}
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
