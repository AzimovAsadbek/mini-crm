import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { trim, trimLower } from '../../../common/utils/transform.util';

export class CreateCustomerDto {
  @ApiProperty({ example: 'IT Solutions' })
  @IsString()
  @MinLength(2, { message: "Kompaniya nomi kamida 2 belgidan iborat bo'lishi kerak" })
  @MaxLength(160)
  @Transform(trim)
  companyName!: string;

  @ApiProperty({ example: 'Anvar Karimov' })
  @IsString()
  @MinLength(3, { message: "To'liq ism kamida 3 belgidan iborat bo'lishi kerak" })
  @MaxLength(120)
  @Transform(trim)
  fullname!: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  @Matches(/^\+?\d[\d\s-]{6,20}$/, { message: "Telefon raqami noto'g'ri formatda" })
  @MaxLength(32)
  @Transform(trim)
  phone!: string;

  @ApiProperty({ example: 'anvar@mail.com' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @MaxLength(160)
  @Transform(trimLower)
  email!: string;

  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  @MinLength(2, { message: "Manzil kamida 2 belgidan iborat bo'lishi kerak" })
  @MaxLength(255)
  @Transform(trim)
  address!: string;
}
