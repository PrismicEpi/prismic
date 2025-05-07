import express from "express";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import reportController from "./routes/reportRoute.js";
import expressListEndpoints from 'express-list-endpoints';
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
app.use("/api", reportController);

// Loggers
console.log("Routes disponibles : ");
console.log(expressListEndpoints(app));

export default app;
