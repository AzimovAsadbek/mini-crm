import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { trim, trimLower } from '../../../common/utils/transform.util';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3, { message: "To'liq ism kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(120)
  @Transform(trim)
  fullname!: string;

  @ApiProperty({ example: 'john@mail.com' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @MaxLength(160)
  @Transform(trimLower)
  email!: string;

  @ApiProperty({ example: 'Parol123!', minLength: 6 })
  @IsString()
  @MinLength(6, { message: "Parol kamida 6 belgidan iborat bo'lishi kerak" })
  @MaxLength(64)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: "Parolda kamida bitta harf va bitta raqam bo'lishi kerak",
  })
  password!: string;
}
