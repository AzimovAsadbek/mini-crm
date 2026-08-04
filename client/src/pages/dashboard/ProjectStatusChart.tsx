import { PROJECT_STATUS } from '@/constants/status';
import { tokens } from '@/theme/tokens';
import type { DashboardStats } from '@/types';
import { Box, Stack, Typography } from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS: Record<string, string> = {
  COMPLETED: tokens.chart.completed,
  IN_PROGRESS: tokens.chart.inProgress,
  PENDING: tokens.chart.pending,
  CANCELLED: tokens.chart.cancelled,
};

export function ProjectStatusChart({ data }: { data: DashboardStats['projectStats'] }) {
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: PROJECT_STATUS[item.status].label,
      value: item.count,
      color: COLORS[item.status],
    }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <Box sx={{ height: 220, display: 'grid', placeItems: 'center' }}>
        <Typography color="text.secondary">Loyihalar mavjud emas</Typography>
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      spacing={2}
      sx={{ height: { xs: 'auto', sm: 220 } }}
    >
      <Box sx={{ width: { xs: '100%', sm: '60%' }, height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
              label={({ value }) => `${Math.round(((value as number) / total) * 100)}%`}
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} ta`, name]}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack spacing={1.25} sx={{ width: { xs: '100%', sm: '40%' } }}>
        {chartData.map((entry) => (
          <Stack key={entry.name} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 11, height: 11, borderRadius: 0.5, bgcolor: entry.color }} />
            <Typography variant="body2" color="text.secondary">
              {entry.name}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
