// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminReportDetails from "./pages/AdminReportDetails";


function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  const handleLogin = () => {
    setShowDashboard(true); // just flip the view
  };

  return (
    <div className="App">
      {showDashboard ? (
        <Router>
          <Routes>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/users/:userId" element={<AdminUserDetails />} />
            <Route path="/reports/:reportId" element={<AdminReportDetails />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
