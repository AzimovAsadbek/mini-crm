import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { emptyToNull, trim, trimToNull } from '../../../common/utils/transform.util';

export class CreateTaskDto {
  @ApiProperty({ example: 1, description: 'Loyiha IDsi' })
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  @IsInt({ message: 'Loyihani tanlang' })
  @IsPositive()
  projectId!: number;

  @ApiPropertyOptional({ example: 2, description: "Mas'ul foydalanuvchi IDsi" })
  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null ? null : Number(value)))
  @IsInt()
  @IsPositive()
  assignedUser?: number | null;

  @ApiProperty({ example: 'Login page yaratish' })
  @IsString()
  @MinLength(2, { message: "Vazifa nomi kamida 2 belgidan iborat bo'lishi kerak" })
  @MaxLength(180)
  @Transform(trim)
  title!: string;

  @ApiPropertyOptional({ example: 'Dizaynga mos login sahifasi' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(trimToNull)
  description?: string | null;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsOptional()
  @IsEnum(TaskStatus, { message: "Holat noto'g'ri tanlangan" })
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority, { message: "Muhimlik darajasi noto'g'ri tanlangan" })
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2024-05-25', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString({}, { message: "Deadline sanasi noto'g'ri formatda" })
  deadline?: string | null;
}
