import { ExperimentModel } from '../models/experimentModel.js';
import { v4 as uuidv4 } from 'uuid';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

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
        const { duration_sec, experiment_date_start, ...restOfBody } = req.body;
        
        const newExperimentData = {
            ...restOfBody,
            experiment_id: uuidv4(),
            experiment_date_start: experiment_date_start || new Date().toISOString(),
            duration_sec: duration_sec ? parseInt(duration_sec) : null
        };

        // Calculate experiment_date_end if duration_sec is available
        if (newExperimentData.duration_sec && newExperimentData.experiment_date_start) {
            const startDate = new Date(newExperimentData.experiment_date_start);
            if (!isNaN(startDate.getTime())) {
                const endDate = new Date(startDate.getTime() + newExperimentData.duration_sec * 1000);
                newExperimentData.experiment_date_end = endDate.toISOString();
            } else {
                console.warn("Invalid experiment_date_start received, cannot calculate experiment_date_end. Received:", experiment_date_start);
            }
        }

        console.log("Data for createExperiment controller:", JSON.stringify(newExperimentData, null, 2));

        const experiment = await ExperimentModel.create(newExperimentData);

        // Generate report for the newly created experiment using R script directly
        try {
            const r = spawn('Rscript', ['src/report/generate_report.R', JSON.stringify({ experiment_id: experiment.experiment_id })]);
            
            let stdoutData = '';
            
            r.stdout.on('data', (data) => {
                stdoutData += data.toString();
            });
            
            r.stderr.on('data', (data) => {
                console.error(`R Script stderr: ${data}`);
            });
            
            r.on('close', async (code) => {
                if (code === 0) {
                    try {
                        // Path to the generated PDF file
                        const pdfPath = path.resolve(process.cwd(), 'src/report/report.pdf');
                        
                        // Check if PDF file exists
                        if (fs.existsSync(pdfPath)) {
                            // Read the PDF file as binary data
                            const pdfBuffer = fs.readFileSync(pdfPath);
                            
                            // Save the PDF report to the experiment record
                            await ExperimentModel.update(
                                { 
                                    report: pdfBuffer,
                                    report_type: 'application/pdf' 
                                },
                                { where: { experiment_id: experiment.experiment_id } }
                            );
                            
                            console.log(`PDF Report successfully saved for experiment ${experiment.experiment_id}`);
                        } else {
                            console.error(`PDF file not found at ${pdfPath}`);
                            
                            // If PDF not found, save the stdout as a text report
                            await ExperimentModel.update(
                                { 
                                    report: Buffer.from(stdoutData, 'utf-8'),
                                    report_type: 'text/plain' 
                                },
                                { where: { experiment_id: experiment.experiment_id } }
                            );
                        }
                    } catch (updateError) {
                        console.error('Error updating experiment with report:', updateError);
                    }
                } else {
                    console.error(`R script process exited with code ${code}`);
                    
                    // Save error info as a text report
                    await ExperimentModel.update(
                        { 
                            report: Buffer.from(`Report generation failed with code ${code}\n${stdoutData}`, 'utf-8'),
                            report_type: 'text/plain' 
                        },
                        { where: { experiment_id: experiment.experiment_id } }
                    );
                }
            });
            
            // Return the created experiment without waiting for the report to be generated
            res.status(201).json(experiment);
        } catch (reportError) {
            console.error('Error spawning R script for report generation:', reportError);
            res.status(201).json(experiment);
        }
    } catch (error) {
        console.error('Error creating experiment in controller:', error);
        // It's also helpful to log the error details that Sequelize might provide
        console.error('Sequelize error details:', JSON.stringify(error, null, 2));
        res.status(500).json({ error: 'Internal server error', details: error.message });
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
