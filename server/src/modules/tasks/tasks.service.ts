import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PaginatedDto } from '../../common/dto/paginated-response.dto';
import { buildOrderBy, buildPaginated } from '../../common/utils/paginate.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const SORTABLE = [
  'id',
  'title',
  'status',
  'priority',
  'deadline',
  'createdAt',
  'updatedAt',
] as const;

const taskInclude = {
  project: { select: { id: true, projectName: true } },
  assignee: { select: { id: true, fullname: true, email: true } },
} satisfies Prisma.TaskInclude;

type TaskWithRelations = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryTasksDto): Promise<PaginatedDto<TaskWithRelations>> {
    const where: Prisma.TaskWhereInput = {
      ...(query.status?.length ? { status: { in: query.status } } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.projectId ? { projectId: query.projectId } : {}),
      ...(query.assignedUser ? { assignedUser: query.assignedUser } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              { project: { projectName: { contains: query.search, mode: 'insensitive' } } },
              { assignee: { fullname: { contains: query.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        include: taskInclude,
        orderBy: buildOrderBy(query.sortBy, query.sortOrder, SORTABLE, 'createdAt'),
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    return buildPaginated(data, total, query.page, query.limit);
  }

  async findOne(id: number): Promise<TaskWithRelations> {
    const task = await this.prisma.task.findUnique({ where: { id }, include: taskInclude });

    if (!task) {
      throw new NotFoundException('Vazifa topilmadi');
    }

    return task;
  }

  async create(dto: CreateTaskDto): Promise<TaskWithRelations> {
    await this.ensureProjectExists(dto.projectId);
    await this.ensureAssigneeExists(dto.assignedUser);

    return this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        assignedUser: dto.assignedUser ?? null,
        title: dto.title,
        description: dto.description ?? null,
        status: dto.status,
        priority: dto.priority,
        deadline: this.toDate(dto.deadline),
      },
      include: taskInclude,
    });
  }

  async update(
    id: number,
    dto: UpdateTaskDto,
    currentUser: AuthenticatedUser,
  ): Promise<TaskWithRelations> {
    const task = await this.findOne(id);
    const data = this.buildUpdateData(dto, task, currentUser);

    if (data.projectId !== undefined) {
      await this.ensureProjectExists(data.projectId as number);
    }

    if (data.assignedUser !== undefined) {
      await this.ensureAssigneeExists(data.assignedUser as number | null);
    }

    return this.prisma.task.update({ where: { id }, data, include: taskInclude });
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });

    return { message: "Vazifa o'chirildi" };
  }

  /**
   * ADMIN barcha maydonlarni tahrirlaydi; oddiy USER esa faqat o'ziga
   * biriktirilgan vazifaning holatini o'zgartira oladi.
   */
  private buildUpdateData(
    dto: UpdateTaskDto,
    task: TaskWithRelations,
    currentUser: AuthenticatedUser,
  ): Prisma.TaskUncheckedUpdateInput {
    if (currentUser.role === Role.ADMIN) {
      return {
        ...(dto.projectId !== undefined ? { projectId: dto.projectId } : {}),
        ...(dto.assignedUser !== undefined ? { assignedUser: dto.assignedUser } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority } : {}),
        ...(dto.deadline !== undefined ? { deadline: this.toDate(dto.deadline) } : {}),
      };
    }

    if (task.assignedUser !== currentUser.id) {
      throw new ForbiddenException("Faqat o'zingizga biriktirilgan vazifani tahrirlay olasiz");
    }

    if (dto.status === undefined) {
      throw new ForbiddenException("Siz faqat vazifa holatini o'zgartira olasiz");
    }

    return { status: dto.status };
  }

  private async ensureProjectExists(projectId: number): Promise<void> {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      throw new BadRequestException('Tanlangan loyiha topilmadi');
    }
  }

  private async ensureAssigneeExists(userId?: number | null): Promise<void> {
    if (!userId) {
      return;
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException("Tanlangan mas'ul foydalanuvchi topilmadi");
    }
  }

  private toDate(value?: string | null): Date | null {
    return value ? new Date(value) : null;
  }
}
