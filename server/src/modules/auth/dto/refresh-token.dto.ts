import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'Login yoki refresh paytida olingan refresh token' })
  @IsJWT({ message: "Refresh token formati noto'g'ri" })
  refreshToken!: string;
}
