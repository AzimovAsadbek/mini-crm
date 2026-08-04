import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './all-exceptions.filter';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.map(exception);

    const body: ErrorResponseBody = {
      statusCode: status,
      message,
      error: exception.code,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private map(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      case 'P2002': {
        const target = (exception.meta?.target as string[] | undefined)?.join(', ');
        return {
          status: HttpStatus.CONFLICT,
          message: target ? `Bunday ${target} allaqachon mavjud` : 'Bunday yozuv allaqachon mavjud',
        };
      }
      case 'P2025':
        return { status: HttpStatus.NOT_FOUND, message: 'Yozuv topilmadi' };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: "Bog'liq yozuv topilmadi yoki o'chirib bo'lmaydi",
        };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: "Bu yozuv boshqa yozuvlar bilan bog'langan",
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Ma'lumotlar bazasida xatolik yuz berdi",
        };
    }
  }
}
