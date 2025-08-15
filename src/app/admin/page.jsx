'use client';

import React, { Suspense } from 'react';
import { EnhancedErrorBoundary } from '../../components/EnhancedErrorBoundary';
import LoadingScreen from '../../components/ui/LoadingScreen';

// Code splitting: Lazy load admin page
const AdminPage = React.lazy(() => import('../../page-components/admin/AdminPage'));

function AdminPageRoute() {
  return (
    <EnhancedErrorBoundary componentName="AdminPage">
      <Suspense fallback={<LoadingScreen message="Loading admin dashboard..." />}>
        <AdminPage />
      </Suspense>
    </EnhancedErrorBoundary>
  );
}

export default AdminPageRoute;
