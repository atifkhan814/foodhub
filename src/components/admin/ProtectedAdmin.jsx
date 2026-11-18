
import { useEffect, useState } from "react";
import { Navigate } from "react-router";

function ProtectedAdmin({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function checkAdmin() {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/users/admin/me",
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    if (!ignore) {
                        setIsAdmin(false);
                    }
                    return;
                }

                const data = await response.json();

                if (!ignore) {
                    setIsAdmin(data.user?.role === "admin");
                }

            } catch (error) {
                console.error("Admin authentication error:", error);

                if (!ignore) {
                    setIsAdmin(false);
                }

            } finally {
                if (!ignore) {
                    setChecking(false);
                }
            }
        }

        checkAdmin();

        return () => {
            ignore = true;
        };
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
