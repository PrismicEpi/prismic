import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

// Create the tour instance
export function createExperienceTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: {
        enabled: true
      },
      classes: 'shadow-md bg-[#1A1C23] text-white rounded-lg',
      scrollTo: true,
      buttons: [
        {
          text: 'Précédent',
          action: function() { return this.back(); },
          classes: 'px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] mr-2'
        },
        {
          text: 'Suivant',
          action: function() { return this.next(); },
          classes: 'px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]'
        }
      ]
    }
  });

  // Add steps to the tour
  tour.addStep({
    id: 'welcome',
    title: 'Bienvenue dans l\'expérience Prismic',
    text: 'Cette visite guidée vous aidera à comprendre comment fonctionne le simulateur d\'expérience quantique. Suivez les étapes pour découvrir toutes les fonctionnalités.',
    buttons: [
      {
        text: 'Commencer',
        action: function() { return this.next(); },
        classes: 'px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]'
      }
    ]
  });

  tour.addStep({
    id: 'configuration-section',
    title: 'Configuration de l\'expérience',
    text: 'Dans cette section, vous pouvez configurer les paramètres de votre expérience quantique, comme le caractère à stocker, le voltage, la fréquence et d\'autres conditions environnementales.',
    attachTo: {
      element: 'h3:first-child',
      on: 'bottom'
    },
    beforeShowPromise: function() {
      return new Promise(function(resolve) {
        setTimeout(resolve, 300);
      });
    }
  });

  tour.addStep({
    id: 'character-input',
    title: 'Caractère à stocker',
    text: 'Entrez ici une lettre unique que vous souhaitez stocker dans la mémoire quantique.',
    attachTo: {
      element: '#character',
      on: 'bottom'
    }
  });

  tour.addStep({
    id: 'laser-parameters',
    title: 'Paramètres du laser',
    text: 'Ajustez ici le voltage, la fréquence et la puissance du laser pour optimiser votre expérience.',
    attachTo: {
      element: 'h4:nth-of-type(1)',
      on: 'bottom'
    }
  });

  tour.addStep({
    id: 'environment-parameters',
    title: 'Paramètres environnementaux',
    text: 'La température et l\'humidité affectent la stabilité de votre stockage quantique. Ajustez ces valeurs pour voir leur impact.',
    attachTo: {
      element: 'h4:nth-of-type(2)',
      on: 'bottom'
    }
  });

  tour.addStep({
    id: 'duration-input',
    title: 'Durée de l\'expérience',
    text: 'Définissez ici la durée de votre expérience en secondes.',
    attachTo: {
      element: '#duration',
      on: 'bottom'
    }
  });

  tour.addStep({
    id: 'presets-dropdown',
    title: 'Préréglages',
    text: 'Vous pouvez utiliser ces configurations prédéfinies pour tester différents scénarios d\'expérience rapidement.',
    attachTo: {
      element: '#preset',
      on: 'bottom'
    }
  });

  tour.addStep({
    id: 'visualization-card',
    title: 'Visualisation en temps réel',
    text: 'Cette section affiche les données en temps réel de votre expérience, y compris la stabilité et la température du système.',
    attachTo: {
      element: '.grid.grid-cols-1 > div:nth-child(2) h3',
      on: 'bottom'
    }
  });

  tour.addStep({
    id: 'launch-button',
    title: 'Lancer l\'expérience',
    text: 'Cliquez sur ce bouton pour démarrer votre expérience avec les paramètres configurés.',
    attachTo: {
      element: 'button:nth-of-type(2)',
      on: 'left'
    }
  });

  tour.addStep({
    id: 'stop-button',
    title: 'Arrêter l\'expérience',
    text: 'Vous pouvez arrêter manuellement l\'expérience à tout moment en utilisant ce bouton.',
    attachTo: {
      element: 'button:nth-of-type(1)',
      on: 'right'
    }
  });

  tour.addStep({
    id: 'results-section',
    title: 'Section des résultats',
    text: 'Les résultats de votre expérience seront affichés ici, y compris les signaux encodés et décodés.',
    attachTo: {
      element: 'h2:nth-of-type(2)',
      on: 'top'
    }
  });

  tour.addStep({
    id: 'recent-experiments',
    title: 'Expériences récentes',
    text: 'Consultez vos expériences récentes dans cette section. Vous pouvez voir tous les détails et comparer les résultats.',
    attachTo: {
      element: 'h2:nth-of-type(3)',
      on: 'top'
    }
  });

  tour.addStep({
    id: 'end-tour',
    title: 'Votre tour est terminé !',
    text: 'Vous êtes maintenant prêt à utiliser le simulateur d\'expérience quantique Prismic. N\'hésitez pas à explorer et à expérimenter avec différentes configurations !',
    buttons: [
      {
        text: 'Terminer',
        action: function() { return this.complete(); },
        classes: 'px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]'
      }
    ]
  });

  return tour;
}

// Store the tour instance for potential reuse
let experienceTour = null;

export function getExperienceTour() {
  if (!experienceTour) {
    experienceTour = createExperienceTour();
  }
  return experienceTour;
}

// Reset the tour (for example when component is unmounted)
export function resetExperienceTour() {
  if (experienceTour) {
    experienceTour.complete();
    experienceTour = null;
  }
} 