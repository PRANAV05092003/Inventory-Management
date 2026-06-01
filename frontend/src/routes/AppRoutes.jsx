import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import PageSkeleton from '../components/ui/PageSkeleton';
import AppShell from '../layouts/AppShell';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const CustomersPage = lazy(() => import('../pages/CustomersPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));

function PageLoader() {
  return <PageSkeleton />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <Suspense fallback={<PageLoader />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProductsPage />
              </Suspense>
            }
          />
          <Route
            path="customers"
            element={
              <Suspense fallback={<PageLoader />}>
                <CustomersPage />
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<PageLoader />}>
                <OrdersPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
