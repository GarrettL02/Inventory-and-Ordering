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
      // Redirect root to /parts/unordered
      {
        path: '/',
        element: <Navigate to="/parts/unordered" replace />,
      },
      // --------------- Routes for parts -----------------
      {
        path: '/parts/unordered',
        element: <LowStockPage />,
      },
      {
        path: '/parts/ordered',
        element: <OrderedPartsPage />,
      },
      {
        path: '/parts/unordered/:id',
        loader: ({ params }) => ({ partId: params.id }),
        element: <PartDetailsPage />,
      },
      // --------------- Routes for part Lookup -----------------
      {
        path: '/parts/partlookup',
        element: <PartLookupPage />,
      },
      //--------------- Routes for forms -----------------
      {
        path: '/parts/partRequest',
        element: <PartRequestForm />,
      },
    ],
  },
]);

export function PageRouter() {
  return <RouterProvider router={router} />;
}
