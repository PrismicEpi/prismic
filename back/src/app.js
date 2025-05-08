import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import experimentRoute from "./routes/experimentRoute.js";
const app = express();

// app.use(authMiddleware);

// Add global middleware
// CORS
const corsOptions = {
  origin: '*', // Only allow this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If you need to support credentials
};
app.use(cors(corsOptions));
// Body parser
app.use(express.json());
// TODO : Add a Logger, voir pour un service tiers qui fait ça bien avec de l'alerting pourquoi pas, ou posthog

// Routes
app.use("/api", authRoute);
app.use("/api", experimentRoute)

export default app;
