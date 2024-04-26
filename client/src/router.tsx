import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Layout from './components/layout';

const routerObject: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/auth',
        async lazy() {
          const { default: Component } = await import('@/pages/auth/page.tsx');
          return { Component };
        },
      },
      {
        path: '/room',
        async lazy() {
          const { default: Component } = await import('@/pages/room/page.tsx');
          return { Component };
        },
      },
      {
        path: '/quiz',
        async lazy() {
          const { default: Component } = await import('@/pages/quiz/page.tsx');
          return { Component };
        },
      },
      {
        path: '/results',
        async lazy() {
          const { default: Component } = await import(
            '@/pages/results/page.tsx'
          );
          return { Component };
        },
      },
    ],
  },
];

const router = createBrowserRouter(routerObject);
export default router;
