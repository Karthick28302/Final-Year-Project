import React from "react";
import { BrowserRouter } from "react-router-dom";
import useEmployeeAuth from "./hooks/useEmployeeAuth";
import EmployeeRoutes from "./routes/EmployeeRoutes";

function App() {
  const { employee, isAuthenticated, login, logout, loading } = useEmployeeAuth();

  return (
    <BrowserRouter>
      <EmployeeRoutes
        employee={employee}
        isAuthenticated={isAuthenticated}
        loading={loading}
        login={login}
        logout={logout}
      />
    </BrowserRouter>
  );
}

export default App;
