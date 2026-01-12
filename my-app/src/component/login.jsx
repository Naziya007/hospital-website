import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ email, password });
      if(res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard"); // redirect after login
      } else {
        setError(res.data.message || "Login failed");
      }
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
        <h2 style={{ textAlign: "center", color: "#0044cc", marginBottom: "30px" }}>Login</h2>

        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
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
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)} 
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
          Login
        </button>

        {error && <p style={{color:"red", marginTop:"15px", textAlign:"center"}}>{error}</p>}

        <p style={{ textAlign:"center", marginTop:"20px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#0044cc", fontWeight: "bold" }}>Register</Link>
        </p>
      </form>
    </div>
  );
}

