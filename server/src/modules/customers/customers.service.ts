import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { PaginatedDto } from '../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { buildOrderBy, buildPaginated } from '../../common/utils/paginate.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

const SORTABLE = ['id', 'companyName', 'fullname', 'email', 'createdAt', 'updatedAt'] as const;

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto): Promise<PaginatedDto<Customer>> {
    const where: Prisma.CustomerWhereInput = query.search
      ? {
          OR: [
            { companyName: { contains: query.search, mode: 'insensitive' } },
            { fullname: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
            { phone: { contains: query.search, mode: 'insensitive' } },
            { address: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [data, total] = await this.prisma.$transaction([
      this.prisma.customer.findMany({
        where,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder, SORTABLE, 'createdAt'),
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.customer.count({ where }),
    ]);

    return buildPaginated(data, total, query.page, query.limit);
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        projects: {
          select: { id: true, projectName: true, status: true, deadline: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { projects: true } },
      },
    });

    if (!customer) {
      throw new NotFoundException('Mijoz topilmadi');
    }

    return customer;
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    await this.ensureEmailIsFree(dto.email);

    return this.prisma.customer.create({ data: dto });
  }

  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(id);

    if (dto.email && dto.email !== customer.email) {
      await this.ensureEmailIsFree(dto.email);
    }

    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.customer.delete({ where: { id } });

    return { message: "Mijoz o'chirildi" };
  }

  /** Loyiha formasidagi "Customer" select uchun. */
  findSelectOptions() {
    return this.prisma.customer.findMany({
      select: { id: true, companyName: true, fullname: true },
      orderBy: { companyName: 'asc' },
    });
  }

  private async ensureEmailIsFree(email: string): Promise<void> {
    const exists = await this.prisma.customer.findUnique({ where: { email } });

    if (exists) {
      throw new ConflictException('Bu email bilan mijoz allaqachon mavjud');
    }
  }
}
