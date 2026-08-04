import { dashboardApi } from '@/api';
import { DataTable, type Column } from '@/components/common/DataTable';
import { StatCard } from '@/components/common/StatCard';
import { StatusChip } from '@/components/common/StatusChip';
import { TASK_STATUS } from '@/constants/status';
import { formatDate } from '@/lib/format';
import { tokens } from '@/theme/tokens';
import type { DashboardStats } from '@/types';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { Box, Card, CardContent, CardHeader, Skeleton, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ProjectStatusChart } from './ProjectStatusChart';
import { TaskTrendChart } from './TaskTrendChart';

type RecentTask = DashboardStats['recentTasks'][number];

const recentTaskColumns: Column<RecentTask>[] = [
  { key: 'index', header: '#', width: 56, render: (_row, index) => index + 1 },
  {
    key: 'title',
    header: 'Vazifa nomi',
    render: (row) => <Typography variant="body2">{row.title}</Typography>,
  },
  { key: 'project', header: 'Loyiha', render: (row) => row.project.projectName },
  {
    key: 'assignee',
    header: "Mas'ul",
    hideBelow: 'md',
    render: (row) => row.assignee?.fullname ?? '—',
  },
  {
    key: 'status',
    header: 'Holat',
    render: (row) => (
      <StatusChip label={TASK_STATUS[row.status].label} tone={TASK_STATUS[row.status].tone} />
    ),
  },
  {
    key: 'createdAt',
    header: 'Sana',
    hideBelow: 'sm',
    render: (row) => formatDate(row.createdAt),
  },
];

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.stats,
  });

  const cards = [
    {
      label: 'Jami mijozlar',
      value: data?.totalCustomers ?? 0,
      color: tokens.stat.customers,
      icon: PeopleAltOutlinedIcon,
    },
    {
      label: 'Jami loyihalar',
      value: data?.totalProjects ?? 0,
      color: tokens.stat.projects,
      icon: WorkOutlineIcon,
    },
    {
      label: 'Jami vazifalar',
      value: data?.totalTasks ?? 0,
      color: tokens.stat.tasks,
      icon: AssignmentOutlinedIcon,
    },
    {
      label: 'Tugallangan',
      value: data?.completedTasks ?? 0,
      color: tokens.stat.completed,
      icon: CheckCircleOutlineIcon,
    },
    {
      label: 'Jarayondagi',
      value: data?.inProgressTasks ?? 0,
      color: tokens.stat.inProgress,
      icon: ScheduleIcon,
    },
  ];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
        }}
      >
        {cards.map((card) =>
          isLoading ? (
            <Skeleton key={card.label} variant="rounded" height={84} />
          ) : (
            <StatCard key={card.label} {...card} />
          ),
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
        }}
      >
        <Card>
          <CardHeader
            title="Loyihalar statistikasi"
            slotProps={{ title: { variant: 'h5' } }}
            sx={{ pb: 0 }}
          />
          <CardContent>
            {isLoading ? (
              <Skeleton variant="rounded" height={220} />
            ) : (
              <ProjectStatusChart data={data?.projectStats ?? []} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Vazifalar statistikasi"
            slotProps={{ title: { variant: 'h5' } }}
            sx={{ pb: 0 }}
          />
          <CardContent>
            {isLoading ? (
              <Skeleton variant="rounded" height={220} />
            ) : (
              <TaskTrendChart data={data?.taskTrend ?? []} />
            )}
          </CardContent>
        </Card>
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <CardHeader
          title="Oxirgi vazifalar"
          slotProps={{ title: { variant: 'h5' } }}
          sx={{ pb: 2 }}
        />
        <DataTable
          columns={recentTaskColumns}
          rows={data?.recentTasks ?? []}
          getRowKey={(row) => row.id}
          isLoading={isLoading}
          emptyMessage="Hozircha vazifalar yo'q"
        />
      </Card>
    </Stack>
  );
}
