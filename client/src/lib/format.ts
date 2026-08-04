/** Maketdagi sana formati — 22.05.2024 */
export function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
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
