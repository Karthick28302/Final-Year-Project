import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Dashboard    from "./pages/Dashboard";
import RegisterUser from "./pages/RegisterUser";
import AttendanceRecords from "./pages/AttendanceRecords";
import LiveMonitoring from "./pages/LiveMonitoring";
import Employees from "./pages/Employees";
import Login        from "./pages/Login";
import Sidebar      from "./components/layout/Sidebar";


const PrivateRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin");
  return isAdmin ? children : <Navigate to="/login" replace />;
};

function Layout() {
  const location   = useLocation();
  const hideSidebar = location.pathname === "/login";

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}

      <div style={{ marginLeft: hideSidebar ? "0" : "220px", width: "100%" }}>
        <Routes>
          <Route path="/"          element={<Navigate to="/login" replace />} />
          <Route path="/login"     element={<Login />} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/register"  element={<PrivateRoute><RegisterUser /></PrivateRoute>} />
          <Route path="/attendance" element={<PrivateRoute><AttendanceRecords /></PrivateRoute>} />
          <Route path="/camera"    element={<PrivateRoute><LiveMonitoring /></PrivateRoute>} />
          <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
