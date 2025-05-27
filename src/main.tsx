import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from "./context/ThemeContext";
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router.tsx';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

const queryClient = new QueryClient()

function App() {
  const auth = useAuth();

  return (
    <RouterProvider router={router} context={auth} />
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)
