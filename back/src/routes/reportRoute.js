import authMiddleware from '../middlewares/authMiddleware.js';
import { Router } from "express";
import { generateReport } from "../controllers/reportController.js";
const router = Router();

// Routes pour la gestion des rapports 
router.post('/generate-report', generateReport);

export default router;