import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminThemeProvider } from './context/AdminThemeContext';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Owner Pages
import Overview from './pages/admin/Overview';
import Profile from './pages/admin/Profile';
import LandingPageEditor from './pages/admin/LandingPageEditor';
import ProductsManager from './pages/admin/ProductsManager';
import GalleryManager from './pages/admin/GalleryManager';
import TestimonialsManager from './pages/admin/TestimonialsManager';
import LeadsManager from './pages/admin/LeadsManager';
import SeoSettings from './pages/admin/SeoSettings';
import DomainSettings from './pages/admin/DomainSettings';

// Super Admin Pages
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

// Public Landing Page
import PublicSite from './pages/PublicSite';

// Loading Component
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children, allowedRoles = [], allowCoManage = false }) {
  const { user, loading } = useAuth();
  const coManageLandingPageId = localStorage.getItem('coManageLandingPageId');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Super Admin dalam mode co-manage boleh akses route yang allowCoManage=true
  if (allowCoManage && user.role === 'SUPER_ADMIN' && coManageLandingPageId) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

function HomeRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} replace />;
}

function App() {
  return (
    <AdminThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Landing Pages */}
          <Route path="/site/:slug" element={<PublicSite />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root redirect */}
          <Route path="/" element={<HomeRoute />} />

          {/* Protected Owner Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/landing-page"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <LandingPageEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <ProductsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/gallery"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <GalleryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/testimonials"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <TestimonialsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/leads"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <LeadsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/seo"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <SeoSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/domain"
            element={
              <ProtectedRoute allowedRoles={['OWNER']}>
                <DomainSettings />
              </ProtectedRoute>
            }
          />

          {/* Protected Super Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sites"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Co-Management Routes: Super Admin mengelola halaman Owner */}
          <Route
            path="/co-manage"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/profile"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/landing-page"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <LandingPageEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/products"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <ProductsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/gallery"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <GalleryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/testimonials"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <TestimonialsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/leads"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <LeadsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/seo"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <SeoSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/co-manage/domain"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']} allowCoManage={true}>
                <DomainSettings />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </AdminThemeProvider>
  );
}

export default App;
