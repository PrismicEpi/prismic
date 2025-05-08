import express from "express";
import cors from "cors";
import expressJSDocSwagger from "express-jsdoc-swagger";
import { swaggerOptions } from "./config/swagger.js";

// import authMiddleware from "./middlewares/authMiddleware.js";
// import keystroke from "./routes/keystrokeRoute.js";
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


// Initialize Swagger
expressJSDocSwagger(app)(swaggerOptions);

// Routes
app.use("/api", authRoute);
app.use("/api", experimentRoute)

export default app;
