import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { trimLower } from '../../../common/utils/transform.util';

export class LoginDto {
  @ApiProperty({ example: 'admin@minicrm.uz' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @Transform(trimLower)
  email!: string;

  @ApiProperty({ example: 'Admin123!' })
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  password!: string;
}
