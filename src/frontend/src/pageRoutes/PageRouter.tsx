import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom';
import { HeaderSidebarComponent } from '../components/headerSidebarComponent/HeaderSidebarComponent';
import { LowStockPage } from '../lowStockParts/pages/LowStockPage';
import { OrderedPartsPage } from '../orderedParts/pages/OrderedPartsPage';
import { PartDetailsPage } from '../lowStockParts/pages/PartDetailsPage';
import { PartRequestForm } from '../lowStockParts/forms/PartRequestForm';
import { ErrorPage } from '../components/errorPage/ErrorPage';
import { AuthGate } from '../auth/AuthGate';
import { LoginPage } from '../auth/LoginPage';
import { PartLookupPage } from '../partLookup/pages/PartLookupPage';
import { SettingsPage } from '../settings/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: (
      <AuthGate>
        <HeaderSidebarComponent>
          <Outlet />
        </HeaderSidebarComponent>
      </AuthGate>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Redirect root to /home
      {
        path: '/',
        element: <Navigate to="/home" replace />,
      },
      // --------------- Routes for home -------------
      {
        path: '/home',
        element: <PartLookupPage />,
      },
      // --------------- Routes for parts -----------------
      {
        path: '/lowstock',
        element: <LowStockPage />,
      },
      {
        path: '/ordered',
        element: <OrderedPartsPage />,
      },
      // --------------- Routes for inventory -----------------
      {
        path: '/inventory',
        element: <PartLookupPage />,
      },
      {
        path: '/inventory/:id',
        loader: ({ params }) => ({ partId: params.id }),
        element: <PartDetailsPage />,
      },
      // --------------- Routes for assets -----------------
      {
        path: '/assets',
        element: <PartLookupPage />,
      },
      // --------------- Routes for settings -----------------
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      //--------------- Routes for forms -----------------
      {
        path: '/partRequest',
        element: <PartRequestForm />,
      },
    ],
  },
]);

export function PageRouter() {
  return <RouterProvider router={router} />;
}
