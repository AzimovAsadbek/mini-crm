import { tokens } from '@/theme/tokens';
import type { DashboardStats } from '@/types';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function TaskTrendChart({ data }: { data: DashboardStats['taskTrend'] }) {
  const theme = useTheme();
  const axisColor = theme.palette.text.secondary;

  return (
    <Box sx={{ height: 220, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={theme.palette.divider} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value) => [`${value} ta`, 'Vazifalar']}
            contentStyle={{ borderRadius: 8, fontSize: 13 }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke={tokens.chart.line}
            strokeWidth={2.5}
            dot={{ r: 4, fill: tokens.chart.line, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
