import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // token clear
    navigate("/login");               // redirect to login
  };

  return (
    <div style={{
      padding: "40px",
      maxWidth: "800px",
      margin: "50px auto",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>
      <h1 style={{ color: "#0044cc", textAlign: "center", marginBottom: "30px" }}>Dashboard</h1>

      <nav style={{ display:"flex", justifyContent:"center", gap:"20px", marginBottom:"30px" }}>
        <Link to="/create-appointment" style={{ color:"#0044cc", fontWeight:"bold" }}>Book Appointment</Link>
        <Link to="/my-appointments" style={{ color:"#0044cc", fontWeight:"bold" }}>My Appointments</Link>
        <button onClick={handleLogout} style={{
          backgroundColor:"#0044cc",
          color:"white",
          border:"none",
          padding:"8px 16px",
          borderRadius:"5px",
          cursor:"pointer"
        }}>Logout</button>
      </nav>

      <p style={{ textAlign:"center", color:"#666" }}>
        Welcome! Use the links above to manage your appointments.
      </p>
    </div>
  );
}
