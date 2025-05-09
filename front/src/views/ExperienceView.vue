<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import NewExperimentSection from '@/components/experience/NewExperimentSection.vue';
import ResultsSection from '@/components/experience/ResultsSection.vue';
import RecentExperimentsSection from '@/components/experience/RecentExperimentsSection.vue';
import { useToast } from 'vue-toastification';

// Références aux composants
const newExperimentSection = ref(null);
// const resultsSection = ref(null); // Ref not strictly needed now
const experimentToShow = ref(null); // Holds details for ResultsSection
const experimentCompletionTimer = ref(null); // Ref for the completion timer
const toast = useToast();

// Computed property for the current input character from ConfigurationCard
const currentInputCharacter = computed(() => {
  return newExperimentSection.value?.configCard?.character || '';
});

// Computed property for whether an experiment is currently active
const isExperimentActive = computed(() => {
  return newExperimentSection.value?.visualizationCard?.status === 'running';
});

// Function called when NewExperimentSection emits 'experiment-launched'
const handleExperimentLaunched = (details) => {
  // console.log('Experiment launched, details received by view:', details);
  
  // Clear any existing timer
  if (experimentCompletionTimer.value) {
    clearTimeout(experimentCompletionTimer.value);
    experimentCompletionTimer.value = null;
  }

  // Update the data passed to ResultsSection
  // Set status explicitly, add end_date as null initially
  experimentToShow.value = {
    ...details,
    status: 'running', // Reflect the active state
    experiment_date_end: null 
  };

  // Set a timer to mark the experiment as completed after its duration
  if (details.duration_sec && details.duration_sec > 0) {
    experimentCompletionTimer.value = setTimeout(() => {
      // console.log(`Experiment ${details.experiment_id} duration finished.`);
      handleExperimentCompleted();
    }, details.duration_sec * 1000);
  }
};

// Function called when the timer completes or when stopped
const handleExperimentCompleted = (stoppedByUser = false) => {
  if (experimentCompletionTimer.value) {
    clearTimeout(experimentCompletionTimer.value);
    experimentCompletionTimer.value = null;
  }

  if (experimentToShow.value) {
    // Update status and end date
    const finalStatus = stoppedByUser 
        ? 'stopped' 
        : (experimentToShow.value.success_rate >= 0.9 ? 'completed' : 
          (experimentToShow.value.success_rate < 0.1 ? 'failed' : 'completed_with_errors'));

    experimentToShow.value = {
        ...experimentToShow.value,
        status: finalStatus,
        experiment_date_end: new Date().toISOString() // Mark completion time
    };

    // Show toast notification (moved from VisualizationCard)
    if (!stoppedByUser) { // Don't toast if user manually stopped (stop button already does)
        let outcomeMessage = "Expérience terminée.";
        if (finalStatus === 'completed') {
            outcomeMessage = "Expérience terminée : Réussite !";
            toast.success(outcomeMessage);
        } else if (finalStatus === 'failed') {
            outcomeMessage = "Expérience terminée : Échec (Crash) !";
            toast.error(outcomeMessage);
        } else { // completed_with_errors
            outcomeMessage = "Expérience terminée : Partielle (Données corrompues).";
            toast.warning(outcomeMessage);
        }
    }
    
    // TODO: Optionally call backend PATCH /api/experiment here to update the record
    // with the final status and experiment_date_end. For now, only frontend state is updated.
    // console.log('Experiment marked as completed/stopped in view state:', experimentToShow.value);

  } else {
      // console.log("Experiment completion/stop triggered, but no experiment data to update.");
  }
};

// Function called when NewExperimentSection emits 'experiment-stopped'
const handleExperimentStopped = () => {
  // console.log("Experiment stop requested by user.");
  handleExperimentCompleted(true); // Mark as completed but indicate it was stopped
};


// Remove simulation from onMounted
onMounted(() => {
  // Clear results on mount
  experimentToShow.value = null;
});
</script>

<template>
  <!-- <MainLayout> -->
    <div class="container mx-auto">
      <!-- <h2 id="nouvelle-experience-title" class="text-2xl font-bold text-white mb-4">Nouvelle Expérience</h2> -->
      <NewExperimentSection 
        ref="newExperimentSection" 
        @experiment-launched="handleExperimentLaunched"
        @experiment-stopped="handleExperimentStopped"
      />
      
      <ResultsSection 
        :experimentDetails="experimentToShow" 
        :currentInputCharacter="currentInputCharacter"
        :isExperimentActive="isExperimentActive"
      />
      
      <RecentExperimentsSection />
    </div>
  <!-- </MainLayout> -->
</template>

