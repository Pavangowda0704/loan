// frontend/src/components/ProtectedApply.jsx
// Wrap any apply page with this — redirects to /login if not logged in,
// then bounces back to the original URL after login.
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedApply({ children }) {
  const { user, loading } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, {
        replace: true,
      });
    }
  }, [user, loading, navigate, location]);

  if (loading || !user) return null;
  return children;
}