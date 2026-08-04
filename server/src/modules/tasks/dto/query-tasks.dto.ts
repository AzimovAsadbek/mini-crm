import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryTasksDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: TaskStatus,
    isArray: true,
    description: "Holat bo'yicha filtr. Bir nechtasini vergul bilan yozish mumkin: PENDING,IN_PROGRESS",
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((item) => item.trim()).filter(Boolean)
      : value,
  )
  @IsEnum(TaskStatus, { each: true })
  status?: TaskStatus[];

  @ApiPropertyOptional({ enum: TaskPriority, description: "Muhimlik bo'yicha filtr" })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: "Loyiha bo'yicha filtr" })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsInt()
  @IsPositive()
  projectId?: number;

  @ApiPropertyOptional({ description: "Mas'ul bo'yicha filtr" })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  @IsInt()
  @IsPositive()
  assignedUser?: number;
}
