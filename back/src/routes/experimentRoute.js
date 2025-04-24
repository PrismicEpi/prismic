import { Router } from "express";
import "../controllers/experimentController.js";
import { getAllExperiments, getExperimentByExperimentId, getExperimentsByUserId, createExperiment, deleteExperimentByHistoryId, deleteExperimentsByUserId, updateExperiment} from "../controllers/experimentController.js";

const router = Router();

router.get('/getAllExperiments', getAllExperiments);
router.get('/getExperimentsByUserId', getExperimentsByUserId);
router.get('/getExperimentByExperimentId', getExperimentByExperimentId);
router.post('/createExperiment', createExperiment);
router.delete('/deleteExperimentByHistoryId',deleteExperimentByHistoryId);
router.delete('/deleteExperimentByUserId',deleteExperimentsByUserId);
router.put('/updateExperiment',updateExperiment);

export default router;