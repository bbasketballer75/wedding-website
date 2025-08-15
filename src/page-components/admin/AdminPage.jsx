import React, { useState, useEffect } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import PasswordPrompt from '../../components/forms/PasswordPrompt';
import './AdminPage.css';

const AdminPage = () => {
  // Use sessionStorage to keep the user "logged in" during their session.
  const [adminKey, setAdminKey] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only access sessionStorage on client side
    if (typeof window !== 'undefined') {
      setAdminKey(sessionStorage.getItem('adminKey'));
      setMounted(true);
    }
  }, []);

  const handleCorrectPassword = (key) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('adminKey', key);
    }
    setAdminKey(key);
  };

  // Show loading state during hydration
  if (!mounted) {
    return <div className="admin-page">Loading...</div>;
  }

  return (
    <div className="admin-page">
      {!adminKey ? (
        <PasswordPrompt onCorrectPassword={handleCorrectPassword} />
      ) : (
        <>
          <h1>Admin Dashboard</h1>
          <p>Review and approve guest submissions.</p>
          <AdminDashboard adminKey={adminKey} />
        </>
      )}
    </div>
  );
};

export default AdminPage;
