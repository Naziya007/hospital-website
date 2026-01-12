import React, { useState } from "react";
import { registerUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await registerUser(form);
      if(res.data.success) navigate("/login");
      else setError(res.data.message || "Registration failed");
    } catch(err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#e6f0ff"
    }}>
      <form 
        onSubmit={handleSubmit} 
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "350px"
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0044cc", marginBottom: "30px" }}>Register</h2>

        <input 
          name="name" 
          placeholder="Name" 
          value={form.name} 
          onChange={handleChange} 
          required 
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
          }}
        />

        <input 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
          }}
        />

        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={handleChange} 
          required 
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "16px"
          }}
        />

        <button 
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#0044cc",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Register
        </button>

        {error && <p style={{color:"red", marginTop:"15px", textAlign:"center"}}>{error}</p>}
      </form>
    </div>
  );
}

