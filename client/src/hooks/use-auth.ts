import { AuthContext } from '@/contexts/auth-context';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth faqat AuthProvider ichida ishlatiladi');
  }

  return context;
}
