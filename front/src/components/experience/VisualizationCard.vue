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
          <div class="text-sm font-medium text-[#E2E8F0] mb-1 flex items-center relative">
            Stabilité
            <div 
              @mouseenter="showStabilityTooltip = true"
              @mouseleave="showStabilityTooltip = false"
              class="ml-2 w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center cursor-help text-xs text-white"
            >
              ?
            </div>
            <div 
              v-if="showStabilityTooltip"
              class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 p-2 bg-[#2D3748] text-white text-xs rounded shadow-lg w-64 z-10"
            >
              La stabilité est calculée en fonction de l'écart par rapport à la fréquence optimale de 50Hz. Une déviation de ±20% est tolérée. Au-delà, le score de stabilité diminue.
            </div>
          </div>
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

// Ref for tooltip visibility
const showStabilityTooltip = ref(false);

const MAX_LIVE_DATA_POINTS = 50; // Maximum points to display on the live chart

// Temperature Management
const BASE_TEMPERATURE = 25.0;
const OVERHEAT_THRESHOLD = 27.0;
const COOLDOWN_COMPLETE_THRESHOLD = 28.0;
const COOLING_RATE = 0.2; // Degrees per second
const COOLING_INTERVAL_MS = 1000;

const isOverheated = ref(false);
const isCooling = ref(false);
const coolingIntervalId = ref(null);

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
    // Generate stable points based on current config, but with fluctuating frequency
    const baseFreq = currentConfigFrequency.value;
    // Fluctuation range, increased to +/- 25% of baseFreq
    const freqFluctuation = (Math.random() - 0.5) * (baseFreq * 0.50); 
    const simulatedFluctuatingFreq = baseFreq + freqFluctuation;

    historyData.push(simulateReceivedIntensityPoint(currentConfigVoltage.value, simulatedFluctuatingFreq));
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
    const baseFreq = currentConfigFrequency.value;
    const freqFluctuation = (Math.random() - 0.5) * (baseFreq * 0.50); 
    const simulatedFluctuatingFreq = baseFreq + freqFluctuation;

    const newPoint = simulateReceivedIntensityPoint(currentConfigVoltage.value, simulatedFluctuatingFreq);
    const newLabel = duration.value; // Use current duration (time in seconds)

    if (liveChartDataPoints.value.length >= MAX_LIVE_DATA_POINTS) {
        liveChartDataPoints.value.shift();
        liveChartLabels.value.shift();
    }
    liveChartDataPoints.value.push(newPoint);
    liveChartLabels.value.push(newLabel);
    
    mainChart.update();
    
    const currentFrequencyScore = calculateFrequencyScore(simulatedFluctuatingFreq);
    stability.value = parseFloat((currentFrequencyScore * 100).toFixed(1));
    
    // Increment duration AFTER using it as a label for the current point
    duration.value = duration.value + 1; 
    temperature.value = parseFloat((temperature.value + COOLING_RATE / 2).toFixed(1)); // Slower heat up for demo or adjust rate

    // Check for overheating during experiment
    if (temperature.value >= OVERHEAT_THRESHOLD && !isOverheated.value) {
      isOverheated.value = true;
      // console.log("[VisCard] System Overheated!");
    }

    if (currentConfigDuration.value > 0) {
      timelineProgress.value = Math.min(100, (duration.value / currentConfigDuration.value) * 100);
    } else {
      timelineProgress.value = 0;
    }
  }
};

// Observer les changements d'état
watch(status, (newStatus, oldStatus) => {
  if (newStatus === 'running') {
    duration.value = 0; // Reset duration for the new run, first point will be at t=0
    timelineProgress.value = 0;
    // temperature.value = 25.0; // Temperature persists and increases from current value

    // Stop cooling if it was in progress
    if (coolingIntervalId.value) {
      clearInterval(coolingIntervalId.value);
      coolingIntervalId.value = null;
    }
    isCooling.value = false;

    liveChartDataPoints.value = [];
    liveChartLabels.value = [];

    if (mainChart) {
        mainChart.update(); // Update chart to show it's empty before first point
    }

    // Plot the first data point immediately
    updateChartData(); 

    let animationInterval = setInterval(() => {
      if (status.value !== 'running') { 
        clearInterval(animationInterval);
        return;
      }
      // Subsequent points will be plotted by the interval
      // The first call to updateChartData already incremented duration, so next point is t=1
      updateChartData(); 
    }, 1000);
    
    if (window.experimentEndTimeout) {
        clearTimeout(window.experimentEndTimeout);
    }
    window.experimentEndTimeout = setTimeout(() => {
      if (status.value === 'running') {
         clearInterval(animationInterval);
         status.value = 'idle';
      }
    }, currentConfigDuration.value * 1000);

  } else { // Not running (idle, ready, error)
    if (window.experimentEndTimeout) { 
        clearTimeout(window.experimentEndTimeout);
    }
    
    // Start cooling if not already cooling and temperature is above base
    if (!isCooling.value && temperature.value > BASE_TEMPERATURE) {
      isCooling.value = true;
      // console.log("[VisCard] Starting cooldown...");
      if (coolingIntervalId.value) clearInterval(coolingIntervalId.value); // Clear previous just in case
      coolingIntervalId.value = setInterval(coolDownTemperature, COOLING_INTERVAL_MS);
    }

    // Clear chart data when not running
    liveChartDataPoints.value = [];
    liveChartLabels.value = [];
    if (mainChart) {
        mainChart.update();
    }
    timelineProgress.value = 0; 
  }
});

const coolDownTemperature = () => {
  if (temperature.value > BASE_TEMPERATURE) {
    temperature.value = parseFloat((temperature.value - COOLING_RATE).toFixed(1));

    if (isOverheated.value && temperature.value < COOLDOWN_COMPLETE_THRESHOLD) {
      isOverheated.value = false;
      // console.log("[VisCard] System cooled down below threshold.");
    }

    if (temperature.value <= BASE_TEMPERATURE) {
      temperature.value = BASE_TEMPERATURE;
      if (coolingIntervalId.value) {
        clearInterval(coolingIntervalId.value);
        coolingIntervalId.value = null;
      }
      isCooling.value = false;
      // console.log("[VisCard] Cooldown complete. Reached base temperature.");
    }
  } else {
    // Should not happen if called correctly, but as a safeguard:
    temperature.value = BASE_TEMPERATURE;
    if (coolingIntervalId.value) {
      clearInterval(coolingIntervalId.value);
      coolingIntervalId.value = null;
    }
    isCooling.value = false;
  }
};

// Exposer les méthodes pour le composant parent
defineExpose({
  status, // Expose the status ref directly
  isOverheated, // Expose overheat status
  setStatus: (newStatus) => {
    // Potentially, the parent could check isOverheated before calling this
    // or this component could refuse to start if overheated.
    // For now, parent is responsible for checking isOverheated status.
    status.value = newStatus;
  },
  primeVisualization: (config) => {
    currentConfigVoltage.value = config.voltage || 0;
    currentConfigFrequency.value = config.frequency || 0;
    currentConfigDuration.value = config.duration || 30;
    currentConfigSuccessRate.value = config.successRate !== undefined ? config.successRate : 1.0;
    currentConfigInputTxt.value = config.inputTxt || 'A';
    
    stability.value = parseFloat((calculateFrequencyScore(currentConfigFrequency.value) * 100).toFixed(1));
    duration.value = 0; // Reset duration display here too for consistency before start
    timelineProgress.value = 0;
    
    // Do NOT manipulate live chart data here. 
    // The status watcher will handle clearing/populating the chart when status becomes 'running'.
    // The overlay "Aucune donnée disponible" handles the view when idle/ready.

    // Update expected signal chart as it's not live data dependent in the same way
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