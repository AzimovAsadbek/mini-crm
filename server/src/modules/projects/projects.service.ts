import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedDto } from '../../common/dto/paginated-response.dto';
import { buildOrderBy, buildPaginated } from '../../common/utils/paginate.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const SORTABLE = ['id', 'projectName', 'status', 'deadline', 'createdAt', 'updatedAt'] as const;

const projectInclude = {
  customer: { select: { id: true, companyName: true, fullname: true } },
  _count: { select: { tasks: true } },
} satisfies Prisma.ProjectInclude;

type ProjectWithRelations = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProjectsDto): Promise<PaginatedDto<ProjectWithRelations>> {
    const where: Prisma.ProjectWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.customerId ? { customerId: query.customerId } : {}),
      ...(query.search
        ? {
            OR: [
              { projectName: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              { customer: { companyName: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        include: projectInclude,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder, SORTABLE, 'createdAt'),
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.project.count({ where }),
    ]);

    return buildPaginated(data, total, query.page, query.limit);
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        ...projectInclude,
        tasks: {
          select: { id: true, title: true, status: true, priority: true, deadline: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Loyiha topilmadi');
    }

    return project;
  }

  async create(dto: CreateProjectDto): Promise<ProjectWithRelations> {
    await this.ensureCustomerExists(dto.customerId);

    return this.prisma.project.create({
      data: {
        customerId: dto.customerId,
        projectName: dto.projectName,
        description: dto.description ?? null,
        status: dto.status,
        deadline: this.toDate(dto.deadline),
      },
      include: projectInclude,
    });
  }

  async update(id: number, dto: UpdateProjectDto): Promise<ProjectWithRelations> {
    await this.findOne(id);

    if (dto.customerId !== undefined) {
      await this.ensureCustomerExists(dto.customerId);
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.customerId !== undefined ? { customerId: dto.customerId } : {}),
        ...(dto.projectName !== undefined ? { projectName: dto.projectName } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.deadline !== undefined ? { deadline: this.toDate(dto.deadline) } : {}),
      },
      include: projectInclude,
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.project.delete({ where: { id } });

    return { message: "Loyiha o'chirildi" };
  }

  /** Vazifa formasidagi "Loyiha" select uchun. */
  findSelectOptions() {
    return this.prisma.project.findMany({
      select: { id: true, projectName: true },
      orderBy: { projectName: 'asc' },
    });
  }

  private async ensureCustomerExists(customerId: number): Promise<void> {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });

    if (!customer) {
      throw new BadRequestException('Tanlangan mijoz topilmadi');
    }
  }

  private toDate(value?: string | null): Date | null {
    return value ? new Date(value) : null;
  }
}
