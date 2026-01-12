import axios from "axios";

const API = axios.create({
  baseURL: "https://hospital-website-2.onrender.com", // backend URL
});

// Token Auto Attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token"); // user token
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// =========================
// AUTH ROUTES
// =========================

// Register User
export const registerUser = (data) => API.post("/auth/register", data);

// Login User
export const loginUser = (data) => API.post("/auth/login", data);


// =========================
// APPOINTMENT ROUTES
// =========================

// Create Appointment
export const createAppointment = (data) => API.post("/apoint/create", data);

// Get My Appointments
export const getMyAppointments = () => API.get("/apoint/my");

