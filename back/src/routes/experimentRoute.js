import { Router } from "express";
import "../controllers/experimentController.js";
import { getAllExperiments, getExperimentByExperimentId, getExperimentsByUserMail, createExperiment, deleteExperimentByExperimentId, deleteExperimentsByUserMail, updateExperiment} from "../controllers/experimentController.js";

/**
 * @typedef {object} Experiment
 * @property {string} experiment_id.required - Experiment UUID
 * @property {string} user_email.required - User email
 * @property {string} input_txt.required - Input text
 * @property {string} experiment_date_start.required - Start date - date-time
 * @property {string} experiment_date_end - End date - date-time
 * @property {string} result_txt - Result text
 * @property {object} laser_config - Laser configuration
 * @property {object} environment_config - Environment configuration
 * @property {string} report - Generated report
 * @property {Array.<Array.<number>>} graph_history - Graph history as array of points
 * @property {number} success_rate - Success rate
 * @property {string} status.required - Experiment status
 */

/**
 * @typedef {object} UpdateExperimentRequest
 * @property {string} experiment_id.required - ID of the experiment to update
 * @property {object} updateFields.required - Fields to update (like status, result_txt, etc.)
 */

const router = Router();

/**
 * GET /api/experiments
 * @summary Get all experiments
 * @tags Experiment
 * @security BearerAuth
 * @return {array<Experiment>} 200 - List of experiments
 */
router.get('/experiments', getAllExperiments);

/**
 * GET /api/experiments/get-by-user-mail
 * @summary Get experiments by user email
 * @tags Experiment
 * @security BearerAuth
 * @param {string} user_email.query.required - User email
 * @return {array<Experiment>} 200 - Experiments of a user
 */
router.get('/experiments/get-by-user-mail', getExperimentsByUserMail);

/**
 * GET /api/experiment/get-by-experiment-id
 * @summary Get a single experiment by ID
 * @tags Experiment
 * @security BearerAuth
 * @param {string} experiment_id.query.required - Experiment ID
 * @return {Experiment} 200 - Experiment details
 */
router.get('/experiment/get-by-experiment-id', getExperimentByExperimentId);

/**
 * POST /api/experiment
 * @summary Create a new experiment
 * @tags Experiment
 * @security BearerAuth
 * @param {Experiment} request.body.required - New experiment data
 * @return {Experiment} 201 - Experiment created
 */
router.post('/experiment', createExperiment);

/**
 * DELETE /api/experiment/delete-by-experiment-id
 * @summary Delete an experiment by ID
 * @tags Experiment
 * @security BearerAuth
 * @param {string} request.body.required - Experiment ID to delete
 * @return {object} 200 - Deletion confirmation
 */
router.delete('/experiment/delete-by-experiment-id', deleteExperimentByExperimentId);

/**
 * DELETE /api/experiments/delete-by-user-mail
 * @summary Delete all experiments for a user
 * @tags Experiment
 * @security BearerAuth
 * @param {string} request.body.required - User email
 * @return {object} 200 - Deletion confirmation
 */
router.delete('/experiments/delete-by-user-mail', deleteExperimentsByUserMail);

/**
 * PATCH /api/experiment
 * @summary Update fields of an experiment
 * @tags Experiment
 * @security BearerAuth
 * @param {UpdateExperimentRequest} request.body.required - Update payload
 * @return {Experiment} 200 - Updated experiment
 */
router.patch('/experiment', updateExperiment);


export default router;