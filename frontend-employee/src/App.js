import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EmployeeSidebar from "./components/layout/EmployeeSidebar";
import useEmployeeAuth from "./hooks/useEmployeeAuth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Holidays from "./pages/Holidays";
import Login from "./pages/Login";
import MyAttendance from "./pages/MyAttendance";
import MySalary from "./pages/MySalary";
import Profile from "./pages/Profile";

const Layout = ({ children, onLogout }) => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <EmployeeSidebar onLogout={onLogout} />
    <main style={{ padding: 16, width: "100%" }}>{children}</main>
  </div>
);

function App() {
  const { employee, isAuthenticated, login, logout, loading } = useEmployeeAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={login} loading={loading} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <Dashboard employee={employee} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <Profile />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/attendance"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <MyAttendance />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/salary"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <MySalary />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/events"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <Events />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/holidays"
          element={
            isAuthenticated ? (
              <Layout onLogout={logout}>
                <Holidays />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
