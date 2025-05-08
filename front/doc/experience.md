# Documentation: Simulation de Nouvelle Expérience

## Introduction

La section "Nouvelle Expérience" vous permet de configurer les paramètres d'une expérience simulée et de visualiser son déroulement ainsi que son résultat prédit. Le système utilise les paramètres que vous définissez pour calculer un taux de réussite simulé, qui détermine ensuite si l'expérience est une réussite totale, partielle (avec corruption de données), ou un échec (crash).

## Configuration des Paramètres (`Carte Configuration`)

Vous pouvez ajuster les paramètres suivants pour influencer le déroulement et le résultat de la simulation :

*   **Caractère à stocker:** Le caractère unique (ex: 'A') que l'expérience tente de stocker et de récupérer.
*   **Voltage (V):** Simule la tension appliquée au laser. Il a une plage optimale (environ 1.5V - 3.5V). Des valeurs trop basses (<0.5V) ou trop hautes (>4.8V) provoqueront un échec quasi certain. En dehors de la plage optimale, il réduit les chances de succès.
*   **Fréquence (Hz):** Simule la fréquence du laser. Elle influence directement la "Stabilité" de la lecture du signal. La fréquence optimale est de 50Hz. S'en éloigner réduit la stabilité et la qualité du signal simulé. Des fréquences trop basses (<10Hz) ou trop hautes (>90Hz) réduisent fortement le succès.
*   **Température (°C):** Simule la température ambiante. La température optimale est de 25°C. Des températures significativement plus hautes (>35°C) ou plus basses (<18°C) réduisent considérablement le taux de réussite.
*   **Humidité (%):** Simule l'humidité ambiante. Ce paramètre a un impact moins critique. Une humidité dans la plage 30-70% est optimale. Les valeurs très extrêmes (<10% ou >90%) ont un léger impact négatif.
*   **Durée de l'expérience (secondes):** Définit la durée pendant laquelle la simulation visuelle s'exécutera et la durée pour laquelle la progression sera affichée.

### Presets

Pour vous aider à démarrer, plusieurs presets sont disponibles. Ils sont conçus pour générer différents résultats probables (haute réussite, partielle, crash) en ajustant les paramètres ci-dessus selon la logique de simulation.

## Visualisation Live (`Carte Visualisation`)

Cette carte montre une simulation en temps réel basée sur la configuration :

*   **État:** Indique l'état actuel de la simulation visuelle (Inactif, En cours, Erreur).
*   **Graphique Principal:**
    *   **Axe Y (Intensité Reçue Sim.):** Représente la force simulée du signal reçu par le prototype. Un signal plus fort et plus stable est généralement meilleur. L'intensité est principalement déterminée par le **Voltage** et la **Fréquence**. Un voltage trop bas ou une fréquence loin de l'optimum réduiront l'intensité simulée. En cas de crash (voltage extrême), l'intensité sera quasi nulle.
    *   **Axe X (Temps):** Représente les pas de temps simulés pendant l'expérience.
*   **Timeline (Barre de Progression):** Apparaît lorsque l'expérience est lancée. Elle montre la progression visuelle de la simulation sur la **Durée** configurée.
*   **Stabilité (%):** Indicateur clé dérivé de la **Fréquence**. Une fréquence proche de l'optimum (50Hz) donnera une stabilité proche de 100%. Plus on s'éloigne, plus la stabilité diminue.
*   **Température (°C):** Affiche une valeur de température (actuellement une valeur statique dans cette carte, non directement liée à la configuration pour l'affichage ici).
*   **Durée (s):** Compteur indiquant depuis combien de temps la simulation visuelle est en cours.

## Calcul du Résultat Simulé (Logique Interne)

Lorsque vous cliquez sur "Lancer Expérience", avant même que la visualisation ne démarre, le système calcule un **Taux de Réussite (`success_rate`)** basé sur la configuration actuelle :

1.  **Scores Individuels:** Chaque paramètre (Température, Humidité, Voltage, Fréquence) est évalué par rapport à sa plage optimale pour générer un score individuel (entre 0 et 1).
    *   Température: Pénalité si trop loin de 25°C.
    *   Humidité: Pénalité légère si hors de 30-70%.
    *   Voltage & Fréquence: Le "Facteur de Puissance Opérationnel" (`Voltage * Fréquence`, optimal autour de 80) et les limites absolues de voltage/fréquence déterminent un score combiné.
2.  **Score Global:** Les scores individuels sont multipliés pour obtenir le `success_rate` global (entre 0 et 1). Une mauvaise performance sur un seul critère critique (comme le voltage) peut entraîner un taux de réussite très bas.
3.  **Résultat Final (`result_txt`):**
    *   **Crash (`success_rate < 0.1`):** L'expérience échoue, le `result_txt` est `null`.
    *   **Réussite Totale (`success_rate >= 0.9`):** L'expérience réussit parfaitement, `result_txt` est identique au `Caractère à stocker`.
    *   **Succès Partiel (`0.1 <= success_rate < 0.9`):** L'expérience se termine, mais les données sont corrompues. `result_txt` est une version altérée de l'entrée (casse inversée pour les lettres).

## Fin de la Simulation Visuelle

*   Une fois la **Durée configurée** écoulée, la simulation visuelle s'arrête.
*   Une notification (toast) apparaît en haut à droite, indiquant le résultat final (Réussite, Partielle, Échec) basé sur le `success_rate` calculé au lancement.
*   L'**État** sur la carte de visualisation repasse à "Inactif".

## Données Enregistrées

Lors du lancement, les informations suivantes sont enregistrées dans la base de données pour cette expérience :
*   Tous les paramètres de configuration (Voltage, Fréquence, Température, Humidité, Durée).
*   Le `Caractère à stocker` (input\_txt).
*   Le **`success_rate` calculé**.
*   Le **`result_txt` déterminé** (peut être `null`, identique à l'entrée, ou altéré).
*   Les données initiales du graphique (`graph_history`).
*   La date/heure de début et la date/heure de fin calculée (`experiment_date_start`, `experiment_date_end`).
*   Le statut initial (`status: "started"`). *Note : La logique pour mettre à jour ce statut vers "completed" ou "failed" sur le backend n'est pas encore implémentée.*

## Bouton "Arrêter"

Le bouton "Arrêter" stoppe immédiatement la **simulation visuelle** en cours sur l'interface (graphique, timeline). Il ne communique pas actuellement avec le backend pour arrêter une expérience réelle.