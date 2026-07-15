import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from './app/router';
import './index.css';
import useAuthStore from './store/auth.store';
import authService from './features/auth/services/auth.service';

if (import.meta.env.DEV) {
  (window as unknown as { authStore: typeof useAuthStore; authService: typeof authService }).authStore =
    useAuthStore;
  (window as unknown as { authStore: typeof useAuthStore; authService: typeof authService }).authService =
    authService;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
