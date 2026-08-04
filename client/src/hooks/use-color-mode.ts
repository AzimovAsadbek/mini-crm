import { ColorModeContext } from '@/contexts/color-mode-context';
import { useContext } from 'react';

export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('useColorMode faqat ColorModeProvider ichida ishlatiladi');
  }

  return context;
}
