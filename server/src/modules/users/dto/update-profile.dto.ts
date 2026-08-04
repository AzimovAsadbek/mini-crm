import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { trim, trimLower } from '../../../common/utils/transform.util';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "To'liq ism kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(120)
  @Transform(trim)
  fullname?: string;

  @ApiPropertyOptional({ example: 'john@mail.com' })
  @IsOptional()
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @MaxLength(160)
  @Transform(trimLower)
  email?: string;
}
