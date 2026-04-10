import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirects to /login if isAdmin is not set in localStorage.
 * Use this at the top of every protected page instead of
 * duplicating the localStorage check everywhere.
 */
function useAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);
}

export default useAuth;