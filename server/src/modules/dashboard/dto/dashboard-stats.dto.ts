import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus, TaskPriority, TaskStatus } from '@prisma/client';

export class ProjectStatusCountDto {
  @ApiProperty({ enum: ProjectStatus })
  status!: ProjectStatus;

  @ApiProperty({ example: 22 })
  count!: number;
}

export class TaskTrendPointDto {
  @ApiProperty({ example: 'Yan', description: 'Oy nomi (qisqartma)' })
  month!: string;

  @ApiProperty({ example: 34, description: 'Shu oyda yaratilgan vazifalar soni' })
  count!: number;
}

export class RecentTaskDto {
  @ApiProperty() id!: number;
  @ApiProperty() title!: string;
  @ApiProperty({ enum: TaskStatus }) status!: TaskStatus;
  @ApiProperty({ enum: TaskPriority }) priority!: TaskPriority;
  @ApiProperty({ nullable: true }) deadline!: Date | null;
  @ApiProperty() createdAt!: Date;

  @ApiProperty({ example: { id: 1, projectName: 'CRM tizim' } })
  project!: { id: number; projectName: string };

  @ApiProperty({ nullable: true, example: { id: 2, fullname: 'John Doe' } })
  assignee!: { id: number; fullname: string } | null;
}

export class DashboardStatsDto {
  @ApiProperty({ example: 128 }) totalCustomers!: number;
  @ApiProperty({ example: 56 }) totalProjects!: number;
  @ApiProperty({ example: 234 }) totalTasks!: number;
  @ApiProperty({ example: 152 }) completedTasks!: number;
  @ApiProperty({ example: 82 }) inProgressTasks!: number;
  @ApiProperty({ example: 40 }) pendingTasks!: number;

  @ApiProperty({ type: [ProjectStatusCountDto] }) projectStats!: ProjectStatusCountDto[];
  @ApiProperty({ type: [TaskTrendPointDto] }) taskTrend!: TaskTrendPointDto[];
  @ApiProperty({ type: [RecentTaskDto] }) recentTasks!: RecentTaskDto[];
}
