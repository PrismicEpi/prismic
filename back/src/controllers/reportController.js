import { spawn } from 'child_process';
import path from 'path';

/**
 * Lancement du script R pour générer un rapport.
 * @param {*} req 
 * @param {*} res 
 */
export const generateReport = (req, res) => {
    const currentDir = process.cwd();

    // Définir le chemin relatif vers le script R à partir du répertoire courant
    console.log(`Lancement du script R depuis : ${currentDir}`);

    // Lancer le script R sans passer de paramètres
    const r = spawn('Rscript', ['src/report/generate_report.R', JSON.stringify(req.body)]);
  
    // Lorsque le script R termine, on envoie la réponse
    r.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send(`Le script R a échoué (code ${code}).`);
        }

        res.status(200).send('Script R lancé avec succès.');
    });
};