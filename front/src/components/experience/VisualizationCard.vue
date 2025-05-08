<template>
  <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg h-full">
    <h3 class="text-xl font-semibold mb-4 text-white">Visualisation Live</h3>
    
    <div class="space-y-4">
      <!-- État de l'expérience -->
      <div class="flex items-center space-x-2">
        <div class="text-sm font-medium text-[#E2E8F0]">État:</div>
        <div class="flex items-center">
          <div 
            class="h-3 w-3 rounded-full mr-2" 
            :class="{
              'bg-green-500': status === 'running',
              'bg-yellow-500': status === 'ready',
              'bg-red-500': status === 'error',
              'bg-gray-500': status === 'idle'
            }"
          ></div>
          <span class="text-sm text-[#E2E8F0]">
            {{ 
              status === 'running' ? 'En cours' : 
              status === 'ready' ? 'Prêt' : 
              status === 'error' ? 'Erreur' : 'Inactif' 
            }}
          </span>
        </div>
      </div>
      
      <!-- Graphique principal -->
      <div class="bg-[#232631] rounded-lg p-4 h-64 relative">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        <div v-if="status !== 'running'" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div class="text-center">
            <p class="text-[#E2E8F0] mb-2">Aucune donnée disponible</p>
            <p class="text-sm text-gray-400">Lancez une expérience pour voir les données en temps réel</p>
          </div>
        </div>
      </div>
      
      <!-- Timeline Progress Bar -->
      <div v-if="status === 'running' || currentConfigDuration > 0" class="mt-2">
        <div class="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progression</span>
          <span>{{ currentConfigDuration }}s</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            class="bg-[#7E3AF2] h-2.5 rounded-full transition-all duration-300 ease-linear"
            :style="{ width: timelineProgress + '%' }"
          ></div>
        </div>
      </div>
      
      <!-- Données des capteurs -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-[#232631] p-3 rounded-lg">
          <div class="text-sm font-medium text-[#E2E8F0] mb-1">Stabilité</div>
          <div class="text-xl font-bold text-white">{{ stability }}%</div>
        </div>
        <div class="bg-[#232631] p-3 rounded-lg">
          <div class="text-sm font-medium text-[#E2E8F0] mb-1">Température</div>
          <div class="text-xl font-bold text-white">{{ temperature }}°C</div>
        </div>
        <!-- <div class="bg-[#232631] p-3 rounded-lg">
          <div class="text-sm font-medium text-[#E2E8F0] mb-1">Durée</div>
          <div class="text-xl font-bold text-white">{{ duration }}s</div>
        </div> -->
      </div>
      
      <!-- Prévisualisation du signal attendu -->
      <div>
        <h4 class="text-md font-medium text-[#E2E8F0] mb-2">Signal attendu</h4>
        <div class="bg-[#232631] rounded-lg p-4 h-24 relative">
          <canvas ref="expectedSignalCanvas" class="w-full h-full"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

// Références pour les canvas
const chartCanvas = ref(null);
const expectedSignalCanvas = ref(null);

// Config values from parent, set when experiment is primed/started
const currentConfigVoltage = ref(1.7); // Default example
const currentConfigFrequency = ref(50);  // Default example
const currentConfigDuration = ref(30); // Default, will be updated by primeVisualization
const currentConfigSuccessRate = ref(1.0); // Store the success rate for feedback
const currentConfigInputTxt = ref('A'); // Store the input character

// État et données
const status = ref('idle'); // 'idle', 'ready', 'running', 'error'
const stability = ref(0); // Will be calculated based on frequency score % 
const temperature = ref(25.0); // Start with a float for easier incrementing
const duration = ref(0); // Current running duration of the live experiment
const timelineProgress = ref(0); // For the timeline bar percentage

// State for the live chart's data
const liveChartLabels = ref([]);
const liveChartDataPoints = ref([]);

// Variables pour les graphiques
let mainChart = null;
let expectedSignalChart = null;

// --- Simulation Helper Functions ---
const OPTIMAL_STABILITY_FREQUENCY = 50; // Hz
const FREQUENCY_TOLERANCE_PCT = 0.2; // +/- 20% around optimal is good

const calculateFrequencyScore = (freq) => {
  if (freq === undefined || freq === null) return 0.5; // Default if no frequency
  const deviation = Math.abs(freq - OPTIMAL_STABILITY_FREQUENCY);
  const toleranceThreshold = OPTIMAL_STABILITY_FREQUENCY * FREQUENCY_TOLERANCE_PCT;

  if (deviation <= toleranceThreshold) return 1.0;
  const score = 1.0 - (deviation - toleranceThreshold) / (OPTIMAL_STABILITY_FREQUENCY - toleranceThreshold);
  return Math.max(0, Math.min(1, score));
};

const VOLTAGE_TO_INTENSITY_FACTOR = 15; // e.g. 2V * 15 = 30 max intensity units
const INTENSITY_NOISE_FACTOR = 0.1; // 10% noise relative to base intensity

const simulateReceivedIntensityPoint = (voltage, freq) => {
  // Check for voltage crash conditions first
  if (voltage < 0.5 || voltage > 4.8) {
    return Math.random() * 0.5; // Return very low noise if voltage is crashing
  }
  if (voltage === undefined) return 0;
  const freqScore = calculateFrequencyScore(freq);
  const maxPotentialIntensity = voltage * VOLTAGE_TO_INTENSITY_FACTOR;
  const baseIntensity = maxPotentialIntensity * freqScore;
  const noise = (Math.random() - 0.5) * baseIntensity * INTENSITY_NOISE_FACTOR;
  return Math.max(0, baseIntensity + noise);
};

// Function to generate a representative waveform based on character ASCII code
const generateExpectedSignalData = (character) => {
  const baseSignal = [0, 0, 5, 10, 15, 20, 25, 30, 25, 20, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0]; // Base shape
  if (!character || character.length !== 1) return baseSignal; // Return base if no valid char

  const charCode = character.charCodeAt(0);
  // Modify the signal based on charCode - simple example: scale amplitude
  const scaleFactor = 1 + ((charCode - 65) % 26) / 50; // Scale slightly based on A=0, B=1 etc.
  const noiseFactor = ((charCode * 3) % 10) / 20; // Add small variance based on charCode
  
  return baseSignal.map(val => Math.max(0, val * scaleFactor + (Math.random() - 0.5) * noiseFactor * val));
};

// Function to generate a dataset for graph_history (NOT for live chart)
const generateHistoryGraphDataset = () => {
  const dataLength = 50; 
  const historyData = [];
  for (let i = 0; i < dataLength; i++) {
    // Generate stable points based on current config
    historyData.push(simulateReceivedIntensityPoint(currentConfigVoltage.value, currentConfigFrequency.value));
  }
  return historyData;
};

// Initialiser les graphiques
onMounted(() => {
  stability.value = parseFloat((calculateFrequencyScore(currentConfigFrequency.value) * 100).toFixed(1)); // Initial stability
  temperature.value = 25.0;
  const mainCtx = chartCanvas.value.getContext('2d');
  mainChart = new Chart(mainCtx, {
    type: 'line',
    data: {
      labels: liveChartLabels.value, // Use live data refs
      datasets: [{
        label: 'Intensité Reçue (stabilité)', 
        data: liveChartDataPoints.value, // Use live data refs
        borderColor: '#7E3AF2',
        backgroundColor: 'rgba(126, 58, 242, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Intensité Reçue (Stabilité)',
            color: '#E2E8F0'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#E2E8F0',
            maxTicksLimit: 10,
            callback: function(value, index, ticks) {
              // 'value' is the actual label value (e.g., 1, 2, ...)
              // For the main chart, these are numerical time progression labels.
              return value + 's';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Temps',
            color: '#E2E8F0'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#E2E8F0',
            maxTicksLimit: 10
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      animation: {
        duration: 0
      }
    }
  });
  
  // Graphique du signal attendu
  const expectedCtx = expectedSignalCanvas.value.getContext('2d');
  expectedSignalChart = new Chart(expectedCtx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 20 }, (_, i) => i),
      datasets: [{
        label: 'Signal attendu',
        data: generateExpectedSignalData(currentConfigInputTxt.value), // Use generator
        borderColor: '#10B981',
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#E2E8F0',
            display: false
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
});

// Fonction pour mettre à jour les données en temps réel
const updateChartData = () => {
  if (mainChart && status.value === 'running') {
    // Update live chart data refs
    liveChartDataPoints.value.shift();
    liveChartDataPoints.value.push(simulateReceivedIntensityPoint(currentConfigVoltage.value, currentConfigFrequency.value));
    
    liveChartLabels.value.shift();
    // Ensure labels are simple incrementing numbers for the window
    liveChartLabels.value.push(liveChartLabels.value.length > 0 ? liveChartLabels.value[liveChartLabels.value.length - 1] + 1 : 1);

    mainChart.update();
    
    stability.value = parseFloat((calculateFrequencyScore(currentConfigFrequency.value) * 100).toFixed(1));
    duration.value = (duration.value + 1);
    temperature.value = parseFloat((temperature.value + 0.1).toFixed(1)); // Increment temperature

    // Update timeline progress
    if (currentConfigDuration.value > 0) {
      timelineProgress.value = Math.min(100, (duration.value / currentConfigDuration.value) * 100);
    } else {
      timelineProgress.value = 0;
    }
  }
};

// Observer les changements d'état
watch(status, (newStatus, oldStatus) => {
  console.log(`[VisCard] Status changed from ${oldStatus} to ${newStatus}`);
  if (newStatus === 'running') {
    duration.value = 0;
    timelineProgress.value = 0;
    temperature.value = 25.0; // Reset temperature on start
    console.log('[VisCard] Experiment starting. Configured duration:', currentConfigDuration.value, 's. Initializing chart data.');

    // Initialize chart data for the running state
    const initialData = generateHistoryGraphDataset(); // Generates 50 points
    liveChartDataPoints.value = [...initialData];
    liveChartLabels.value = Array.from({ length: initialData.length }, (_, i) => i + 1);

    if (mainChart) {
        mainChart.update(); // Ensure chart re-renders with new reactive data
    }

    let animationInterval = setInterval(() => {
      if (status.value !== 'running') { 
        clearInterval(animationInterval);
        return;
      }
      updateChartData();
    }, 1000);
    
    // Use configured duration for the animation timeout
    // Clear previous timeouts if any (safety measure)
    if (window.experimentEndTimeout) {
        clearTimeout(window.experimentEndTimeout);
    }
    window.experimentEndTimeout = setTimeout(() => {
      if (status.value === 'running') {
         clearInterval(animationInterval);
         console.log('[VisCard] Experiment timer ended. Current status:', status.value, '. Setting to idle.');
         
         // Determine outcome based on the success rate passed during priming
         // Remove toast logic - parent component will handle final feedback
         /*
         let outcomeMessage = "Expérience terminée.";
         if (currentConfigSuccessRate.value >= 0.9) {
             outcomeMessage = "Expérience terminée : Réussite !";
             toast.success(outcomeMessage);
         } else if (currentConfigSuccessRate.value < 0.1) {
             outcomeMessage = "Expérience terminée : Échec (Crash) !";
             toast.error(outcomeMessage);
         } else {
             outcomeMessage = "Expérience terminée : Partielle (Données corrompues).";
             toast.warning(outcomeMessage);
         }
         */
         
         status.value = 'idle'; // Reset status to idle visually
      }
    }, currentConfigDuration.value * 1000); 
  } else {
    // Reset timeline and potentially clear live data if desired when stopped/idle
    timelineProgress.value = 0; 
    // liveChartLabels.value = []; // Optional: clear on stop/idle
    // liveChartDataPoints.value = []; // Optional: clear on stop/idle
    // mainChart?.update(); // Update if clearing data
  }
});

// Exposer les méthodes pour le composant parent
defineExpose({
  status, // Expose the status ref directly
  setStatus: (newStatus) => {
    status.value = newStatus;
  },
  primeVisualization: (config) => {
    currentConfigVoltage.value = config.voltage || 0;
    currentConfigFrequency.value = config.frequency || 0;
    currentConfigDuration.value = config.duration || 30;
    currentConfigSuccessRate.value = config.successRate !== undefined ? config.successRate : 1.0;
    currentConfigInputTxt.value = config.inputTxt || 'A'; // Store input character
    console.log('[VisCard] primeVisualization called with config:', JSON.parse(JSON.stringify(config)));
    stability.value = parseFloat((calculateFrequencyScore(currentConfigFrequency.value) * 100).toFixed(1));
    temperature.value = 25.0; // Reset temp display on prime
    
    // When priming, update the chart data if the chart exists,
    // This prepares the visual even if it's hidden by the overlay.
    if (mainChart) {
      const primedData = generateHistoryGraphDataset();
      liveChartDataPoints.value = [...primedData];
      liveChartLabels.value = Array.from({ length: primedData.length }, (_, i) => i + 1);
      
      mainChart.update();
    }
    // Update expected signal chart as well
    if (expectedSignalChart) {
        expectedSignalChart.data.datasets[0].data = generateExpectedSignalData(currentConfigInputTxt.value);
        expectedSignalChart.update();
    }
  },
  updateExpectedSignal: (newCharacter) => {
    if (newCharacter && typeof newCharacter === 'string' && newCharacter.length === 1) {
        currentConfigInputTxt.value = newCharacter;
        if (expectedSignalChart) {
            expectedSignalChart.data.datasets[0].data = generateExpectedSignalData(currentConfigInputTxt.value);
            expectedSignalChart.update();
        }
    }
  },
  getInitialGraphData: () => {
    // Generate fresh data based on current config for history, ignore live chart state
    const historyDataPoints = generateHistoryGraphDataset();
    const historyLabels = Array.from({ length: historyDataPoints.length }, (_, i) => i);
    return historyLabels.map((label, index) => {
      const yValue = (typeof historyDataPoints[index] === 'number' && !isNaN(historyDataPoints[index])) ? historyDataPoints[index] : 0;
      return [parseFloat(label), parseFloat(yValue.toFixed(4))];
    });
  }
});
</script> 