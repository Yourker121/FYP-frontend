import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import PatientDashboard from "./components/dashboard/PatientDashboard";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import VerifyEmail from "./components/VerifyEmail";
import Payment from "./components/Payment";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/Payment" element={<Payment />} />
      </Routes>
    </>
  );
}

export default App;
