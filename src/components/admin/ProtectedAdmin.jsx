
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

function ProtectedAdmin({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(
          'http://localhost:8000/api/users/me',
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          setIsAdmin(false);
          return;
        }

        const data = await response.json();

        setIsAdmin(data.user?.role === 'admin');

      } catch (error) {
        console.error('Admin authentication error:', error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    }

    checkAdmin();
  }, []);

  if (checking) {
    return <p>Checking admin access...</p>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedAdmin;
