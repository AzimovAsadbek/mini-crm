import { type PaginatedDto } from '../dto/paginated-response.dto';

export function buildPaginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedDto<T> {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

/**
 * Foydalanuvchi yuborgan `sortBy` ni oq ro'yxat bilan cheklaydi —
 * aks holda Prisma noma'lum maydonda xato beradi.
 */
export function buildOrderBy<T extends string>(
  sortBy: string | undefined,
  sortOrder: 'asc' | 'desc',
  allowed: readonly T[],
  fallback: T,
): Record<string, 'asc' | 'desc'> {
  const field = allowed.includes(sortBy as T) ? (sortBy as T) : fallback;
  return { [field]: sortOrder };
}
