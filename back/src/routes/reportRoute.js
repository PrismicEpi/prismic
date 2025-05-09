import authMiddleware from '../middlewares/authMiddleware.js';
import { Router } from "express";
import { generateReport, getReport } from "../controllers/reportController.js";
const router = Router();

// Routes pour la gestion des rapports 
router.post('/generate-report', generateReport);
router.get('/report/:experiment_id', getReport);

export default router;