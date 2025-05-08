<script setup>
import { ref, onMounted, nextTick } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import NewExperimentSection from '@/components/experience/NewExperimentSection.vue';
import ResultsSection from '@/components/experience/ResultsSection.vue';
import RecentExperimentsSection from '@/components/experience/RecentExperimentsSection.vue';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

// Références aux composants
const newExperimentSection = ref(null);
const resultsSection = ref(null);

// Shepherd.js CDN injection (for rapid prototyping)
// Why: Using CDN for fast integration and no local dependency management
if (!window.Shepherd) {
  const shepherdScript = document.createElement('script');
  shepherdScript.src = 'https://cdn.jsdelivr.net/npm/shepherd.js@9.1.2/dist/js/shepherd.min.js';
  shepherdScript.async = true;
  document.head.appendChild(shepherdScript);
  const shepherdCss = document.createElement('link');
  shepherdCss.rel = 'stylesheet';
  shepherdCss.href = 'https://cdn.jsdelivr.net/npm/shepherd.js@9.1.2/dist/css/shepherd.css';
  document.head.appendChild(shepherdCss);
}

// Function to start the Shepherd tour
const startTour = async () => {
  // Why: Simple one-step tour for demo, targets the 'Nouvelle Expérience' title
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      classes: 'shepherd-theme-arrows',
      scrollTo: true
    }
  });
  tour.addStep({
    title: 'Bienvenue !',
    text: 'Commencez ici pour lancer une nouvelle expérience.',
    attachTo: {
      element: '#nouvelle-experience-title',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Terminer',
        action: tour.complete
      }
    ]
  });
  tour.start();
};

// Simuler la fin d'une expérience et mettre à jour les résultats
onMounted(() => {
  // Simuler un délai pour charger les données
  setTimeout(() => {
    if (resultsSection.value) {
      resultsSection.value.updateResults({
        sentCharacter: 'A',
        receivedCharacter: 'A',
        successRate: 95,
        retentionTime: 48
      });
    }
  }, 1000);
  // Start Shepherd walkthrough automatically on page load
  console.log('Shepherd walkthrough auto-start triggered');
  startTour();
});
</script>

<template>
  <MainLayout>
    <div class="container mx-auto">
      <!-- Shepherd.js walkthrough trigger -->
      <button
        class="mb-4 px-4 py-2 bg-[#7E3AF2] text-white rounded hover:bg-[#6C2BD9]"
        @click="startTour"
      >
        Démarrer le guide
      </button>
      <!-- Section Nouvelle Expérience -->
      <h2 id="nouvelle-experience-title" class="text-2xl font-bold text-white mb-4">Nouvelle Expérience</h2>
      <NewExperimentSection ref="newExperimentSection" />
      
      <!-- Section Résultats -->
      <ResultsSection ref="resultsSection" />
      
      <!-- Section Expériences Récentes -->
      <RecentExperimentsSection />
    </div>
  </MainLayout>
</template>

