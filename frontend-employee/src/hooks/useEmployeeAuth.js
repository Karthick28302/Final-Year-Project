import { useEffect, useState } from "react";
import { getCurrentEmployee, loginEmployee } from "../services/authService";

const TOKEN_KEY = "employee_token";
const EMPLOYEE_KEY = "employee_user";

const useEmployeeAuth = () => {
  const [employee, setEmployee] = useState(() => {
    const raw = localStorage.getItem(EMPLOYEE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(localStorage.getItem(TOKEN_KEY));

  const login = async ({ identifier, password }) => {
    setLoading(true);
    try {
      const data = await loginEmployee({ identifier, password });
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data.employee));
      setEmployee(data.employee);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMPLOYEE_KEY);
    setEmployee(null);
  };

  const refreshMe = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    try {
      const me = await getCurrentEmployee();
      const normalized = {
        id: me.id,
        role: me.role,
        email: me.email,
        employeeCode: me.employeeCode,
      };
      setEmployee((prev) => {
        const merged = { ...prev, ...normalized };
        localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(merged));
        return merged;
      });
    } catch {
      logout();
    }
  };

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    employee,
    loading,
    isAuthenticated,
    login,
    logout,
  };
};

export default useEmployeeAuth;
