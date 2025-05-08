import { Router } from "express";
import "../controllers/experimentController.js";
import { getAllExperiments, getExperimentByExperimentId, getExperimentsByUserMail, createExperiment, deleteExperimentByExperimentId, deleteExperimentsByUserMail, updateExperiment} from "../controllers/experimentController.js";


const router = Router();

router.get('/experiments', getAllExperiments);
router.get('/experiments/get-by-user-mail', getExperimentsByUserMail);
router.get('/experiment/get-by-experiment-id', getExperimentByExperimentId);
router.post('/experiment', createExperiment);
router.delete('/experiment/delete-by-experiment-id', deleteExperimentByExperimentId);
router.delete('/experiments/delete-by-user-mail', deleteExperimentsByUserMail);
router.patch('/experiment', updateExperiment);


export default router;