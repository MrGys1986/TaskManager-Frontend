import React from "react";
import { Navigate } from "react-router-dom";

// ✅ Función que verifica si el usuario está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // 🔹 Devuelve `true` si hay un token, `false` si no.
};

// ✅ Componente de Ruta Protegida
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
