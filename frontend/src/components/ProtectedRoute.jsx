import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070B] text-gray-400">
        Yükleniyor...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}