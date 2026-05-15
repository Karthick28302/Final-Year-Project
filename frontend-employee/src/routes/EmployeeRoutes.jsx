import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import EmployeeSidebar from "../components/layout/EmployeeSidebar";
import Topbar from "../components/layout/Topbar";
import Dashboard from "../pages/Dashboard";
import Events from "../pages/Events";
import Holidays from "../pages/Holidays";
import Login from "../pages/Login";
import MyAttendance from "../pages/MyAttendance";
import MySalary from "../pages/MySalary";
import Profile from "../pages/Profile";

const Layout = ({ children, onLogout }) => (
  <div style={{ display: "flex", minHeight: "100vh" }}>
    <EmployeeSidebar onLogout={onLogout} />
    <main style={{ padding: 16, width: "100%" }}>
      <Topbar />
      {children}
    </main>
  </div>
);

const EmployeeRoutes = ({ employee, isAuthenticated, loading, login, logout }) => (
  <Routes>
    <Route
      path="/login"
      element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={login} loading={loading} />
      }
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <Layout onLogout={logout}>
            <Dashboard employee={employee} />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/profile"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <Layout onLogout={logout}>
            <Profile />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/attendance"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <Layout onLogout={logout}>
            <MyAttendance />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/salary"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <Layout onLogout={logout}>
            <MySalary />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/events"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <Layout onLogout={logout}>
            <Events />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route
      path="/holidays"
      element={
        <ProtectedRoute isAllowed={isAuthenticated}>
          <Layout onLogout={logout}>
            <Holidays />
          </Layout>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
  </Routes>
);

export default EmployeeRoutes;
