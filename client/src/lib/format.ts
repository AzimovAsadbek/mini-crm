/**
 * Maketdagi sana formati — 22.05.2024.
 * `Intl` ba'zi muhitlarda `uz-UZ` uchun ISO ko'rinish qaytargani sababli
 * format qo'lda yig'iladi.
 */
export function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
}

/**
 * Deadline'gacha qolgan kunlar. Manfiy son — muddat o'tib ketgan.
 * Vaqt qismi hisobga olinmaydi, faqat kalendar kunlari solishtiriladi.
 */
export function daysUntil(value?: string | null): number | null {
  if (!value) {
    return null;
  }

  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return Math.round((startOfDay(target) - startOfDay(new Date())) / 86_400_000);
}

/** `<input type="date">` uchun YYYY-MM-DD */
export function toDateInputValue(value?: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

export function getInitials(fullname?: string): string {
  if (!fullname) {
    return '?';
  }

  return fullname
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/** Maketdagi "1 - 5 of 128" satri */
export function formatRange(page: number, limit: number, total: number): string {
  if (total === 0) {
    return '0 - 0 of 0';
  }

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return `${from} - ${to} of ${total}`;
}
