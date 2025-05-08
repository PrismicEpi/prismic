import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

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
            return res.status(500).send('Le fichier PDF n’a pas été généré.');
        }

        // Envoie le fichier PDF en réponse
        res.sendFile(path.resolve("src/report/report.pdf"), (err) => {
            if (err) {
                console.error('Erreur lors de l’envoi du PDF :', err);
                res.status(500).send('Erreur lors de l’envoi du PDF.');
            }
        });
    });
};