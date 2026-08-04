import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PaginatedDto } from '../../common/dto/paginated-response.dto';
import { buildOrderBy, buildPaginated } from '../../common/utils/paginate.util';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthUserDto } from '../auth/dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SORTABLE = ['id', 'fullname', 'email', 'role', 'createdAt', 'updatedAt'] as const;
const BCRYPT_ROUNDS = 10;

/** Parol hech qachon javobga tushmasligi uchun aniq select. */
const userSelect = {
  id: true,
  fullname: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryUsersDto): Promise<PaginatedDto<AuthUserDto>> {
    const where: Prisma.UserWhereInput = {
      ...(query.role ? { role: query.role } : {}),
      ...(query.search
        ? {
            OR: [
              { fullname: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder, SORTABLE, 'createdAt'),
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return buildPaginated(data, total, query.page, query.limit);
  }

  async findOne(id: number): Promise<AuthUserDto & { _count: { tasks: number } }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { ...userSelect, _count: { select: { tasks: true } } },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  async create(dto: CreateUserDto): Promise<AuthUserDto> {
    await this.ensureEmailIsFree(dto.email);

    return this.prisma.user.create({
      data: {
        fullname: dto.fullname,
        email: dto.email,
        password: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
        role: dto.role ?? Role.USER,
      },
      select: userSelect,
    });
  }

  async update(id: number, dto: UpdateUserDto): Promise<AuthUserDto> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      await this.ensureEmailIsFree(dto.email);
    }

    if (user.role === Role.ADMIN && dto.role === Role.USER) {
      await this.ensureNotLastAdmin(id);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.fullname !== undefined ? { fullname: dto.fullname } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.role !== undefined ? { role: dto.role } : {}),
        ...(dto.password ? { password: await bcrypt.hash(dto.password, BCRYPT_ROUNDS) } : {}),
      },
      select: userSelect,
    });
  }

  async remove(id: number, currentUserId: number): Promise<{ message: string }> {
    if (id === currentUserId) {
      throw new BadRequestException("O'z hisobingizni o'chira olmaysiz");
    }

    const user = await this.findOne(id);

    if (user.role === Role.ADMIN) {
      await this.ensureNotLastAdmin(id);
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: "Foydalanuvchi o'chirildi" };
  }

  async updateProfile(id: number, dto: UpdateProfileDto): Promise<AuthUserDto> {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      await this.ensureEmailIsFree(dto.email);
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: userSelect,
    });
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException("Joriy parol noto'g'ri");
    }

    await this.prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS) },
    });

    // Parol o'zgargach barcha seanslar bekor qilinadi.
    await this.prisma.refreshToken.deleteMany({ where: { userId: id } });

    return { message: "Parol muvaffaqiyatli o'zgartirildi" };
  }

  /** Task formasidagi "Mas'ul" select uchun — sahifalashsiz yengil ro'yxat. */
  findAssignableUsers(): Promise<Pick<AuthUserDto, 'id' | 'fullname' | 'email'>[]> {
    return this.prisma.user.findMany({
      select: { id: true, fullname: true, email: true },
      orderBy: { fullname: 'asc' },
    });
  }

  private async ensureEmailIsFree(email: string): Promise<void> {
    const exists = await this.prisma.user.findUnique({ where: { email } });

    if (exists) {
      throw new ConflictException('Bu email allaqachon band');
    }
  }

  private async ensureNotLastAdmin(id: number): Promise<void> {
    const admins = await this.prisma.user.count({
      where: { role: Role.ADMIN, id: { not: id } },
    });

    if (admins === 0) {
      throw new BadRequestException('Tizimda kamida bitta admin qolishi kerak');
    }
  }
}
