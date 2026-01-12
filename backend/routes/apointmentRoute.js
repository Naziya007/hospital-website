import express from "express";
import { auth } from "../middlewere/authMiddlewere.js";
import { createAppointment, getMyAppointments } from "../controllers/apointment.js";

const router = express.Router();

router.post("/create", auth, createAppointment);   // Logged-in required
router.get("/my", auth, getMyAppointments);       // Logged-in required

export default router;
