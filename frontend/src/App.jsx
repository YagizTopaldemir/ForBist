import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Ipo from "./pages/Ipo";
import News from "./pages/News";
import AiAssistant from "./pages/AiAssistant";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";



function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
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
  }, []);

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

function ProtectedPage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Landing />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedPage>
              <Portfolio />
            </ProtectedPage>
          }
        />

        <Route
          path="/ipo"
          element={
            <ProtectedPage>
              <Ipo />
            </ProtectedPage>
          }
        />

        <Route
          path="/news"
          element={
            <ProtectedPage>
              <News />
            </ProtectedPage>
          }
        />

        <Route
          path="/ai-assistant"
          element={
            <ProtectedPage>
              <AiAssistant />
            </ProtectedPage>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedPage>
              <Transactions />
            </ProtectedPage>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedPage>
              <Settings />
            </ProtectedPage>
          }
        />

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}