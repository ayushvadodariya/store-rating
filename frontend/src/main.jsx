import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from '@/router.jsx';
import { QueryClientProvider, QueryClient} from '@tanstack/react-query';

const queryClinet = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClinet}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
