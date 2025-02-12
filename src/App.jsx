import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import DashboardPage from "./components/Pages/DashboardPage";
import AdminProtectedRoute from "./components/protectedroutes/protect";
import { Toaster } from "react-hot-toast";
import DoctorPage from "./components/Pages/DoctorPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <AdminProtectedRoute>
              <DashboardPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addDoctor"
          element={
            <AdminProtectedRoute>
              <DoctorPage />
            </AdminProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
