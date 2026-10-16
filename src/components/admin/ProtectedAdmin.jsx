
import { Navigate } from 'react-router';

function ProtectedAdmin({ children }) {
  const isAdminLoggedIn =
    localStorage.getItem('foodhub_admin_logged_in') === 'true';

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedAdmin;
