import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "To'liq ism kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(120)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullname?: string;

  @ApiPropertyOptional({ example: 'john@mail.com' })
  @IsOptional()
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @MaxLength(160)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email?: string;
}
