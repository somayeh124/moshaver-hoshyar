/* eslint-disable import/no-unresolved */
import { lazy, Suspense } from 'react'; 
import { Outlet, Navigate, useRoutes } from 'react-router-dom'; 

import DashboardLayout from 'src/layouts/dashboard'; 


export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const ConsultantReservation = lazy(() => import('src/sections/overview/ConsultantReservation'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const EditProfile = lazy(() => import('src/sections/overview/editProfile'));
export const Calendar = lazy(() => import('src/sections/overview/app-Consultant'));
export const TransactionHistory = lazy(() => import('src/sections/overview/transactionHistory'));

// ----------------------------------------------------------------------

// تعریف کامپوننت Router
export default function Router() {
  // استفاده از useRoutes برای تعریف مسیرها
  const routes = useRoutes([
    {
      // تعریف مسیرهای داخل داشبورد
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet /> {/* Outlet برای رندر کردن کامپوننت‌های فرزند */}
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true }, // صفحه اصلی
        { path: 'ConsultantReservation', element: <ConsultantReservation /> }, // مسیر برای رزرو مشاور
        { path: 'products', element: <ProductsPage /> }, // مسیر برای محصولات
        { path: 'blog', element: <BlogPage /> }, // مسیر برای بلاگ
        { path: 'edit', element: <EditProfile /> }, // مسیر برای ویرایش پروفایل
        { path: 'date', element: <Calendar /> }, // مسیر برای تقویم مشاور
        { path: 'transactionHistory', element: <TransactionHistory /> }, // مسیر برای تاریخچه تراکنش‌ها
      ],
    },
    {
      // مسیر برای صفحه ورود
      path: 'login',
      element: <LoginPage />,
    },
    {
      // مسیر برای صفحه 404
      path: '404',
      element: <Page404 />,
    },
    {
      // مسیریابی به صفحه 404 برای مسیرهای ناشناخته
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes; // بازگشت مسیرهای تعریف شده
}

