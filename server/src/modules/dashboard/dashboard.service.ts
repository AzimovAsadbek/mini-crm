import { Injectable } from '@nestjs/common';
import { ProjectStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DashboardStatsDto, TaskTrendPointDto } from './dto/dashboard-stats.dto';

const MONTH_LABELS = [
  'Yan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Iyun',
  'Iyul',
  'Avg',
  'Sen',
  'Okt',
  'Noy',
  'Dek',
];

const TREND_MONTHS = 7;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<DashboardStatsDto> {
    const trendStart = this.startOfMonth(TREND_MONTHS - 1);

    const [
      totalCustomers,
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      projectGroups,
      trendRows,
      recentTasks,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.project.count(),
      this.prisma.task.count(),
      this.prisma.task.count({ where: { status: TaskStatus.COMPLETED } }),
      this.prisma.task.count({ where: { status: TaskStatus.IN_PROGRESS } }),
      this.prisma.task.count({ where: { status: TaskStatus.PENDING } }),
      this.prisma.project.groupBy({
        by: ['status'],
        _count: { _all: true },
        orderBy: { status: 'asc' },
      }),
      this.prisma.task.findMany({
        where: { createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      this.prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          deadline: true,
          createdAt: true,
          project: { select: { id: true, projectName: true } },
          assignee: { select: { id: true, fullname: true } },
        },
      }),
    ]);

    const countsByStatus = new Map(
      projectGroups.map((group) => [group.status, group._count._all]),
    );

    return {
      totalCustomers,
      totalProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      projectStats: Object.values(ProjectStatus).map((status) => ({
        status,
        count: countsByStatus.get(status) ?? 0,
      })),
      taskTrend: this.buildTrend(trendRows.map((row) => row.createdAt)),
      recentTasks,
    };
  }

  /** Oxirgi TREND_MONTHS oyni bo'sh oylar bilan birga to'ldiradi. */
  private buildTrend(dates: Date[]): TaskTrendPointDto[] {
    const buckets = new Map<string, number>();

    for (let offset = TREND_MONTHS - 1; offset >= 0; offset -= 1) {
      buckets.set(this.bucketKey(this.startOfMonth(offset)), 0);
    }

    for (const date of dates) {
      const key = this.bucketKey(date);

      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    }

    return [...buckets.entries()].map(([key, count]) => ({
      month: MONTH_LABELS[Number(key.split('-')[1])],
      count,
    }));
  }

  private startOfMonth(monthsAgo: number): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  }

  private bucketKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}`;
  }
}
