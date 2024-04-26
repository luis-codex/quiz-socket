import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './globals.css';
import router from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster duration={1000} position='top-right' expand />
  </React.StrictMode>
);
