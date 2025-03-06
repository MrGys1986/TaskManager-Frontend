import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import DashboardPage from "./Pages/Dashboard/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import GroupsPage from './Pages/Groups/GroupsPage';
import GroupTasksPage from './Pages/Groups/GroupTasksPage';
import AdminUsersPage from './Pages/Admin/AdminUsersPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ✅ Envolver las rutas protegidas dentro de PrivateRoute */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><GroupsPage /></PrivateRoute>} />
      <Route path="/group/:groupId" element={<PrivateRoute><GroupTasksPage /></PrivateRoute>} />
      <Route path="/admin-users" element={<PrivateRoute><AdminUsersPage /></PrivateRoute>} />
    </Routes>
  );
}

export default AppRoutes;
