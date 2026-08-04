import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from './use-debounce';

const PAGE_SIZE = 10;

/**
 * Ro'yxat sahifalari uchun umumiy holat: qidiruv (debounce bilan),
 * filtrlar va sahifa raqami. Qidiruv/filtr o'zgarganda sahifa 1 ga qaytadi.
 */
export function useListControls<F extends Record<string, string>>(initialFilters: F) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<F>(initialFilters);

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const setFilter = useCallback((key: keyof F, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  }, []);

  const query = useMemo(
    () => ({ page, limit: PAGE_SIZE, search: debouncedSearch, ...filters }),
    [page, debouncedSearch, filters],
  );

  return { page, setPage, search, setSearch, filters, setFilter, query };
}
