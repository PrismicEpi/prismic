import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { ExperimentModel } from '../models/experimentModel.js';

/**
 * Lancement du script R pour générer un rapport.
 * @param {*} req 
 * @param {*} res 
 */
export const generateReport = (req, res) => {
    const r = spawn('Rscript', ['src/report/generate_report.R', JSON.stringify(req.body)]);

    // Lorsque le script R termine, on envoie la réponse
    r.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send(`Le script R a échoué (code ${code}).`);
        }

        // Vérifie si le PDF a bien été généré
        if (!fs.existsSync("src/report/report.pdf")) {
            return res.status(500).send("Le fichier PDF n'a pas été généré.");
        }

        // Envoie le fichier PDF en réponse
        res.sendFile(path.resolve("src/report/report.pdf"), (err) => {
            if (err) {
                console.error("Erreur lors de l'envoi du PDF :", err);
                res.status(500).send("Erreur lors de l'envoi du PDF.");
            }
        });
    });
};

// Serve report as PDF or appropriate format
export const getReport = async (req, res) => {
    try {
        const { experiment_id } = req.params;
        
        if (!experiment_id) {
            return res.status(400).json({ error: 'experiment_id is required' });
        }
        
        const experiment = await ExperimentModel.findOne({ where: { experiment_id } });
        
        console.log(experiment);
        if (!experiment) {
            return res.status(404).json({ error: 'Experiment not found' });
        }
        
        if (!experiment.report) {
            return res.status(404).json({ error: 'No report available for this experiment' });
        }
        
        // Set appropriate content type based on report_type
        const contentType = experiment.report_type || 'application/pdf';
        res.setHeader('Content-Type', contentType);
        
        // For PDFs, set Content-Disposition for browser handling
        if (contentType === 'application/pdf') {
            res.setHeader('Content-Disposition', `inline; filename="report-${experiment_id}.pdf"`);
        }
        
        // Send the report buffer directly
        res.send(experiment.report);
        
    } catch (error) {
        console.error('Error retrieving report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};