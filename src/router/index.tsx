import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    // usuario entra
    element: <Navigate to="/tracking" replace />,
  },
  {
    path: '/tracking',
    // Cargamos el Dashboard base (con la lista siempre visible)
    element: <DashboardPage />,
    children: [
      {
        path: ':orderId',        
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '*',
    // Cualquier ruta inexistente o rota vuelve al inicio seguro
    element: <Navigate to="/tracking" replace />,
  },
]);