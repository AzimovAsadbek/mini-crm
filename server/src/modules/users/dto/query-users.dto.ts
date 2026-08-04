import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryUsersDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: Role, description: "Rol bo'yicha filtr" })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
