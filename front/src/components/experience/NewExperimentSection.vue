<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-4">Nouvelle Expérience</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Carte Configuration -->
      <ConfigurationCard 
        ref="configCard" 
        :isExperimentActive="visualizationCard?.status === 'running'"
      />
      
      <!-- Carte Visualisation Live -->
      <VisualizationCard ref="visualizationCard" />
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex justify-end space-x-4">
      <!-- Stop Button -->
      <button 
        @click="stopExperiment"
        :disabled="visualizationCard?.status !== 'running' || isLaunching"
        class="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd" />
        </svg>
        <span>Arrêter</span>
      </button>

      <!-- Launch Button -->
      <button 
        @click="launchExperiment"
        :disabled="isLaunching || visualizationCard?.status === 'running'"
        class="px-6 py-3 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        <LoaderCircle v-if="isLaunching" class="animate-spin h-5 w-5" />
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
        </svg>
        <span>{{ isLaunching ? 'Lancement...' : 'Lancer Expérience' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';
import ConfigurationCard from './ConfigurationCard.vue';
import VisualizationCard from './VisualizationCard.vue';
import { useAuthStore } from '@/stores/authStore';
import { createExperimentApi } from '@/apis/experimentService.js';
import { useToast } from 'vue-toastification';
import { LoaderCircle } from 'lucide-vue-next';

// Define emits
const emit = defineEmits(['experiment-launched', 'experiment-stopped']);

// Références aux composants enfants
const configCard = ref(null);
const visualizationCard = ref(null);
const authStore = useAuthStore();
const isLaunching = ref(false);
const toast = useToast();

// Watch the exposed character ref from ConfigurationCard
watch(() => configCard.value?.character, (newChar) => {
  if (newChar && visualizationCard.value) {
    visualizationCard.value.updateExpectedSignal(newChar);
  }
}, { immediate: false }); // Don't run immediately on mount, wait for user changes

// Watch for status changes from VisualizationCard to understand button states
watch(() => visualizationCard.value?.status, (newStatus, oldStatus) => {
  // Log button disabled states for clarity
  const launchButtonDisabled = isLaunching.value || newStatus === 'running';
  const stopButtonDisabled = newStatus !== 'running' || isLaunching.value;
});

// --- Success Rate Calculation Logic ---
const calculateTemperatureScore = (temp) => {
  const optimalTemp = 25;
  const maxDeviation = 10; // Temp score becomes low beyond this deviation
  let score = 1.0;

  if (temp > 35 || temp < 18) return 0.2; // Severe penalty for extremes

  const deviation = Math.abs(temp - optimalTemp);
  score = Math.max(0, 1.0 - (deviation / maxDeviation) * 0.8); // Penalty, but don't drop below 0.2 too quickly this way
  return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
};

const calculateHumidityScore = (humidity) => {
  if (humidity >= 30 && humidity <= 70) return 1.0;
  if ((humidity >= 10 && humidity < 30) || (humidity > 70 && humidity <= 90)) return 0.85;
  return 0.7; // Extremes
};

const calculatePowerBalanceScore = (voltage, frequency) => {
  let voltageBaseScore = 1.0;
  if (voltage < 0.5 || voltage > 4.8) return 0.0; // Crash condition
  if (voltage < 1.5 || voltage > 3.5) voltageBaseScore = 0.5;

  if (frequency < 10 || frequency > 90) return Math.min(voltageBaseScore, 0.1); // Near crash if freq is out of bounds

  const optimalOPF = 80;
  const opf = voltage * frequency;
  const opfDeviationFactor = Math.abs(opf - optimalOPF) / optimalOPF; // Percentage deviation
  // Score reduces proportionally to deviation, max reduction of 0.8 from this factor
  const opfScore = Math.max(0.2, 1.0 - opfDeviationFactor * 0.8); 

  return Math.max(0, Math.min(1, voltageBaseScore * opfScore)); // Clamp between 0 and 1
};

const determineResultText = (inputTxt, successRate) => {
  if (successRate < 0.1) return null; // Crash
  if (successRate >= 0.9) return inputTxt; // Full success
  
  // Partial success - flip case for single letters
  if (inputTxt && inputTxt.length === 1) {
    const charCode = inputTxt.charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) { // Uppercase A-Z
      return inputTxt.toLowerCase();
    } else if (charCode >= 97 && charCode <= 122) { // Lowercase a-z
      return inputTxt.toUpperCase();
    }
  }
  return '?'; // Default for non-alphabetic or multi-char input if it occurs
};
// --- End of Success Rate Calculation Logic ---

const launchExperiment = async () => {
  if (!configCard.value || !visualizationCard.value) {
    console.error('Configuration or Visualization card not available');
    toast.error('Erreur interne: Composants de configuration non disponibles.');
    return;
  }

  isLaunching.value = true;

  const userEmail = authStore.user?.email;
  if (!userEmail) {
    console.error("User email not found. Cannot start experiment.");
    toast.error("Email utilisateur non trouvé. Veuillez vous reconnecter.");
    isLaunching.value = false;
    return;
  }

  const configData = configCard.value.getConfigurationData();
  const currentCharacter = configCard.value.character; // Get character directly from exposed ref

  // Validate character just before launch (safety check)
  if (!currentCharacter || !/^[a-zA-Z]$/.test(currentCharacter)) {
      toast.error("Caractère à stocker invalide. Veuillez entrer une seule lettre.");
      isLaunching.value = false;
      return;
  }

  // Calculate success rate and result_txt based on configData and currentCharacter
  const tempScore = calculateTemperatureScore(configData.temperature);
  const humidityScore = calculateHumidityScore(configData.humidity);
  const powerScore = calculatePowerBalanceScore(configData.voltage_tension, configData.frequency);
  
  let calculatedSuccessRate = tempScore * humidityScore * powerScore;
  calculatedSuccessRate = Math.max(0, Math.min(1, calculatedSuccessRate));

  const finalResultText = determineResultText(currentCharacter, calculatedSuccessRate);

  // Prime the visualization with the current config AND the calculated success rate
  if (visualizationCard.value) {
    visualizationCard.value.primeVisualization({ 
      voltage: configData.voltage_tension, 
      frequency: configData.frequency, 
      duration: configData.duration_sec, 
      successRate: calculatedSuccessRate,
      // inputTxt: currentCharacter // No longer needed in primeVisualization
    });
  }

  // Now get graph data after priming
  const graphHistoryData = visualizationCard.value.getInitialGraphData();

  const experimentData = {
    ...configData,
    input_txt: currentCharacter, // Add character to the payload
    user_email: userEmail,
    experiment_date_start: new Date().toISOString(),
    status: "finished",
    graph_history: graphHistoryData,
    result_txt: finalResultText, // Use the calculated result text
    success_rate: parseFloat(calculatedSuccessRate.toFixed(4)), // Use the calculated success rate
  };

  console.log('Experiment Data to be sent (includes graph_history):', JSON.stringify(experimentData, null, 2));

  try {
    const result = await createExperimentApi(experimentData);
    // Use result (which includes the DB generated ID) if needed
    const launchedExperimentDetails = {
        ...experimentData, // Include all calculated data sent
        experiment_id: result.experiment_id // Add the actual ID from backend response
    };

    emit('experiment-launched', launchedExperimentDetails); // Emit details of launched experiment

    if (visualizationCard.value) {
      visualizationCard.value.setStatus('running');
    }
    toast.success("Expérience lancée avec succès!");
  } catch (error) {
    console.error('[NewExpSection] Failed to create experiment:', error);
    toast.error(`Erreur: ${error.message || 'Impossible de lancer l\'expérience.'}`);
    if (visualizationCard.value) {
      visualizationCard.value.setStatus('error');
    }
  } finally {
    isLaunching.value = false;
  }
};

const stopExperiment = () => {
  if (visualizationCard.value) {
    visualizationCard.value.setStatus('idle');
  }
  emit('experiment-stopped'); // Emit stop event
  toast.info("Visualisation de l'expérience arrêtée.");
};

// Exposer les méthodes pour le composant parent
defineExpose({
  configCard,
  visualizationCard
});
</script> 