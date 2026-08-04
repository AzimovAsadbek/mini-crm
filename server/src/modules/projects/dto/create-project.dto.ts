import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
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

export class CreateProjectDto {
  @ApiProperty({ example: 1, description: 'Mijoz IDsi' })
  @Transform(({ value }) => (value === '' || value === null ? undefined : Number(value)))
  @IsInt({ message: 'Mijozni tanlang' })
  @IsPositive()
  customerId!: number;

  @ApiProperty({ example: 'CRM tizim' })
  @IsString()
  @MinLength(2, { message: "Loyiha nomi kamida 2 belgidan iborat bo'lishi kerak" })
  @MaxLength(160)
  @Transform(trim)
  projectName!: string;

  @ApiPropertyOptional({ example: 'Ichki jarayonlarni avtomatlashtirish' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(trimToNull)
  description?: string | null;

  @ApiPropertyOptional({ enum: ProjectStatus, default: ProjectStatus.PENDING })
  @IsOptional()
  @IsEnum(ProjectStatus, { message: "Holat noto'g'ri tanlangan" })
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: '2024-06-30', description: 'YYYY-MM-DD' })
  @IsOptional()
  @Transform(emptyToNull)
  @IsDateString({}, { message: "Deadline sanasi noto'g'ri formatda" })
  deadline?: string | null;
}
