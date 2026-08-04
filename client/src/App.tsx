import { AppRouter } from '@/app/router';
import { AuthProvider } from '@/contexts/auth-context';
import { ColorModeProvider } from '@/contexts/color-mode-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
            <Toaster
              position="top-right"
              toastOptions={{ style: { fontSize: 14 }, duration: 3000 }}
            />
          </AuthProvider>
        </BrowserRouter>
      </ColorModeProvider>
    </QueryClientProvider>
  );
}
