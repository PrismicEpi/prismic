import { ExperimentModel } from '../models/experimentModel.js';
import { v4 as uuidv4 } from 'uuid';

// GET Methods
export const getAllExperiments = async (req, res) => {
    try {
        const experiments = await ExperimentModel.findAll();
        res.status(200).json(experiments);
    } catch (error) {
        console.error('Error fetching experiment history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getExperimentsByUserMail = async (req, res) => {
    try {
        const { user_email } = req.query;
        if (!user_email) {
            return res.status(400).json({ error: 'user_email is required' });
        }
        const experiments = await ExperimentModel.findAll({ where: { user_email } });
        res.status(200).json(experiments);
    } catch (error) {
        console.error('Error fetching experiments by user ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getExperimentByExperimentId = async (req, res) => {
    try {
        const { experiment_id } = req.query;
        if (!experiment_id) {
            return res.status(400).json({ error: 'experiment_id is required' });
        }
        const experiment = await ExperimentModel.findOne({ where: { experiment_id } });
        if (!experiment) {
            return res.status(404).json({ error: 'Experiment not found' });
        }
        res.status(200).json(experiment);
    } catch (error) {
        console.error('Error fetching experiment by history ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// POST Methods
export const createExperiment = async (req, res) => {
    try {
        const {
            experiment_id = uuidv4(),
            user_email,
            input_txt,
            result_txt = null,
            experiment_date_start,
            experiment_date_end = null,
            laser_config = null,
            environment_config = null,
            report = null,
            graph_history = [],
            success_rate = null,
            status = 'IN PROGRESS'
        } = req.body;

        const newExperiment = await ExperimentModel.create({
            experiment_id,
            user_email,
            input_txt,
            result_txt,
            experiment_date_start,
            experiment_date_end,
            laser_config,
            environment_config,
            report,
            graph_history,
            success_rate,
            status
        });

        res.status(201).json(newExperiment);
    } catch (error) {
        console.error('Error creating experiment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE Methods
export const deleteExperimentByExperimentId = async (req, res) => {
    try {
        const { experiment_id } = req.body;
        if (!experiment_id) {
            return res.status(400).json({ error: 'experiment_id is required' });
        }
        const deleted = await ExperimentModel.destroy({ where: { experiment_id } });
        if (!deleted) {
            return res.status(404).json({ error: 'Experiment not found' });
        }
        res.status(200).json({ message: 'Experiment deleted successfully' });
    } catch (error) {
        console.error('Error deleting experiment by history ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteExperimentsByUserMail = async (req, res) => {
    try {
        const { user_email } = req.body;
        if (!user_email) {
            return res.status(400).json({ error: 'user_email is required' });
        }
        const deleted = await ExperimentModel.destroy({ where: { user_email } });
        if (!deleted) {
            return res.status(404).json({ error: 'No experiments found for the user' });
        }
        res.status(200).json({ message: 'All experiments for the user deleted successfully' });
    } catch (error) {
        console.error('Error deleting experiments by user ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// UPDATE Methods
export const updateExperiment = async (req, res) => {
    try {
        const { experiment_id, updateFields } = req.body;

        if (!experiment_id) {
            return res.status(400).json({ error: 'experiment_id is required' });
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'No fields provided for update' });
        }

        const experiment = await ExperimentModel.findOne({ where: { experiment_id } });
        if (!experiment) {
            return res.status(404).json({ error: 'Experiment not found' });
        }

        if (updateFields.graph_history) {
            if (!Array.isArray(updateFields.graph_history) || updateFields.graph_history.length !== 2) {
                return res.status(400).json({ error: 'graph_history must be an array of exactly two floats' });
            }
            experiment.graph_history.push(updateFields.graph_history);
            delete updateFields.graph_history;
        }

        await experiment.update(updateFields);

        res.status(200).json({ message: 'Experiment updated successfully', experiment });
    } catch (error) {
        console.error('Error updating experiment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
