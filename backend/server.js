

// server.js
import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import apointmentRoute from "./routes/apointmentRoute.js"


dotenv.config();
const app = express();
// Middlewares
// app.use(cors({ origin: "http://localhost:5173" }));  
// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",                 // local dev
  "https://hospital-website-aul7.onrender.com" // deployed frontend
 // deployed frontend" // deployed frontend
];

// Middlewares
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server requests
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // allow cookies if needed
}));
app.use(express.json());


// Connect Database
connectDB();


app.get('/', (req, res) => {
res.send('Backend Server Running');
});
app.use("/auth", authRoutes);
app.use("/apoint", apointmentRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));