<template>
  <div class="mt-8">
    <h2 class="text-2xl font-bold text-white mb-4">Résultats</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Graphiques côte à côte -->
      <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg">
        <h3 class="text-xl font-semibold mb-4 text-white">
          Signal Encodé <span v-if="currentInputCharacter">({{ currentInputCharacter }})</span>
        </h3>
        <div class="bg-[#232631] rounded-lg p-4 h-64">
          <canvas ref="encodedSignalCanvas" class="w-full h-full"></canvas>
        </div>
      </div>
      
      <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg">
        <h3 class="text-xl font-semibold mb-4 text-white">Signal Décodé</h3>
        <div class="bg-[#232631] rounded-lg p-4 h-64">
          <canvas ref="decodedSignalCanvas" class="w-full h-full"></canvas>
        </div>
      </div>
      
      <!-- Carte de métriques -->
      <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg lg:col-span-2">
        <h3 class="text-xl font-semibold mb-4 text-white">Métriques</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Comparaison caractère -->
          <div class="bg-[#232631] p-4 rounded-lg">
            <div class="text-sm font-medium text-[#E2E8F0] mb-2">Caractère</div>
            <div class="flex items-center space-x-4">
              <div class="bg-[#1A1C23] p-3 rounded-lg text-center w-16">
                <div class="text-xs text-[#E2E8F0] mb-1">Envoyé</div>
                <div class="text-2xl font-bold text-white">{{ sentCharacter }}</div>
              </div>
              <div v-if="!isExperimentActive">
                <div class="text-[#7E3AF2]">→</div>
                <div class="bg-[#1A1C23] p-3 rounded-lg text-center w-16">
                  <div class="text-xs text-[#E2E8F0] mb-1">Reçu</div>
                  <div class="text-2xl font-bold text-white">{{ receivedCharacter }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Taux de réussite -->
          <div class="bg-[#232631] p-4 rounded-lg">
            <div class="text-sm font-medium text-[#E2E8F0] mb-2">Taux de réussite</div>
            <div class="flex items-center justify-between">
              <div class="text-3xl font-bold text-white">{{ successRate }}%</div>
              <div class="w-16 h-16 relative">
                <svg class="w-full h-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#1A1C23" stroke-width="2"></circle>
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="16" 
                    fill="none" 
                    :stroke="successRateColor" 
                    stroke-width="2" 
                    stroke-dasharray="100" 
                    :stroke-dashoffset="100 - successRate"
                    transform="rotate(-90 18 18)"
                  ></circle>
                </svg>
                <div class="absolute inset-0 flex items-center justify-center text-xs font-medium" :class="successRateTextColor">
                  {{ successRateLabel }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Durée configurée -->
          <div class="bg-[#232631] p-4 rounded-lg">
            <div class="text-sm font-medium text-[#E2E8F0] mb-2">Durée configurée</div>
            <div class="flex items-center justify-between">
              <div class="text-3xl font-bold text-white">{{ configuredDuration }}</div>
              <div class="text-sm text-[#E2E8F0]">secondes</div>
            </div>
            <!-- Progress bar removed -->
          </div>
        </div>
        
        <!-- Boutons d'action -->
        <div class="flex flex-wrap gap-3 mt-6">
          <button class="px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger
          </button>
          <button class="px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Voir dans l'historique
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  experimentDetails: {
    type: Object,
    default: null
  },
  currentInputCharacter: {
    type: String,
    default: ''
  },
  isExperimentActive: {
    type: Boolean,
    default: false
  }
});

// Références pour les canvas
const encodedSignalCanvas = ref(null);
const decodedSignalCanvas = ref(null);

// Chart instances
let encodedChart = null;
let decodedChart = null;

// Données des résultats (reactive, updated by watcher)
const sentCharacter = ref('-');
const receivedCharacter = ref('-');
const successRate = ref(0);
// const retentionTime = ref(0); // Renamed/repurposed
const configuredDuration = ref(0); // Store configured duration in seconds

// Remove retentionPercentage computed property
// const retentionPercentage = computed(() => { ... });

// Couleur du taux de réussite
const successRateColor = computed(() => {
  if (successRate.value >= 90) return '#10B981'; // vert
  if (successRate.value >= 70) return '#F59E0B'; // orange
  return '#EF4444'; // rouge
});

// Texte du taux de réussite
const successRateTextColor = computed(() => {
  if (successRate.value >= 90) return 'text-green-500';
  if (successRate.value >= 70) return 'text-yellow-500';
  return 'text-red-500';
});

// Label du taux de réussite
const successRateLabel = computed(() => {
  if (successRate.value >= 90) return 'Excellent';
  if (successRate.value >= 70) return 'Bon';
  return 'Faible';
});

// --- Graph Generation Logic ---
// (Moved before the watcher)
const generateSignalData = (character, length = 100) => {
  const emptyData = Array(length).fill(0);
  if (!character || character.length !== 1) return emptyData;

  const baseShape = [0, 5, 15, 25, 30, 25, 15, 5, 0]; // Simple peak shape
  const baseLength = baseShape.length;
  const repeatCount = Math.floor(length / baseLength);
  const charCode = character.charCodeAt(0);
  const scale = 1 + ((charCode - 65) % 26) * 0.02; // Scale amplitude slightly
  const variance = ((charCode * 7) % 10) * 0.05; // Add noise

  let signal = [];
  for (let r = 0; r < repeatCount; r++) {
      signal = signal.concat(baseShape.map(v => Math.max(0, v * scale + (Math.random() - 0.5) * variance * v)));
  }
  // Fill remaining points
  signal = signal.concat(Array(length - signal.length).fill(0));

  return signal;
};

// Chart initialization function (Moved before watcher)
const initializeChart = (canvasRef, chartVarName, label, data, borderColor, bgColor) => {
    if (!canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d');
    const chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: data.length }, (_, i) => i),
            datasets: [{
                label: label,
                data: data,
                borderColor: borderColor,
                backgroundColor: bgColor,
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: { // Simplified options from original code
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#E2E8F0' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
                x: { ticks: { color: '#E2E8F0', maxTicksLimit: 10 }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
            },
            plugins: { legend: { display: false } }
        }
    });
    // Assign to global variable (encodedChart or decodedChart)
    if (chartVarName === 'encodedChart') encodedChart = chartInstance;
    if (chartVarName === 'decodedChart') decodedChart = chartInstance;
};

// Function to update or create graphs (Moved before watcher)
const updateGraphs = (inputChar, resultChar) => {
    const encodedData = generateSignalData(inputChar);
    
    let decodedData;
    if (props.isExperimentActive) {
        // If an experiment is currently active, decoded signal data should be effectively empty.
        decodedData = generateSignalData(null); // generateSignalData(null) produces an array of zeros
    } else {
        // If no experiment is active (i.e., it's finished or never started),
        // use the resultChar from props.experimentDetails.
        decodedData = generateSignalData(resultChar);
    }

    // Update encoded chart
    if (encodedChart) {
        encodedChart.data.labels = Array.from({ length: encodedData.length }, (_, i) => i);
        encodedChart.data.datasets[0].data = encodedData;
        encodedChart.update();
    } else if (encodedSignalCanvas.value) {
        initializeChart(encodedSignalCanvas, 'encodedChart', 'Signal Encodé', encodedData, '#7E3AF2', 'rgba(126, 58, 242, 0.1)');
    }

    // Update or initialize decoded chart
    if (decodedChart) {
        decodedChart.data.labels = Array.from({ length: decodedData.length }, (_, i) => i);
        decodedChart.data.datasets[0].data = decodedData; // This will be empty data if active
        decodedChart.update();
    } else if (decodedSignalCanvas.value) {
        // Only initialize if the canvas is present (section is visible) AND chart doesn't exist yet.
        // decodedData here will be from generateSignalData(resultChar) or zeros based on the logic above.
        initializeChart(decodedSignalCanvas, 'decodedChart', 'Signal Décodé', decodedData, '#10B981', 'rgba(16, 185, 129, 0.1)');
    }
};

// --- Watcher for prop changes ---
watch(() => [props.experimentDetails, props.isExperimentActive], ([newDetails, newIsActive]) => {
    // console.log('[ResultsSection] Watcher triggered. New Details:', newDetails, 'IsActive:', newIsActive);
    if (newDetails) {
        sentCharacter.value = newDetails.input_txt || '-';
        // Display receivedCharacter based on newDetails, visibility handled by v-if tied to isExperimentActive
        receivedCharacter.value = newDetails.result_txt !== null ? (newDetails.result_txt || '?') : '-'; 
        successRate.value = newDetails.success_rate !== null ? Math.round(newDetails.success_rate * 100) : 0; 
        configuredDuration.value = newDetails.duration_sec || 0;
        
        updateGraphs(newDetails.input_txt, newDetails.result_txt);

    } else {
        // Reset if experimentDetails becomes null
        sentCharacter.value = '-';
        receivedCharacter.value = '-';
        successRate.value = 0;
        // retentionTime.value = 0; // Removed
        configuredDuration.value = 0;
        updateGraphs(null, null); // This will ensure decodedData is empty via the logic in updateGraphs
    }
}, { immediate: true, deep: true }); // immediate for initial run, deep for object changes in experimentDetails

// Initialiser les graphiques
onMounted(() => {
    // The immediate watcher should handle initial chart rendering if experimentDetails is present.
    // If canvas refs weren't ready for the immediate watcher, nextTick provides a second chance.
    nextTick(() => {
        // console.log('[ResultsSection] onMounted nextTick. EncodedChart:', !!encodedChart, 'DecodedChart:', !!decodedChart);
        // console.log('[ResultsSection] experimentDetails:', props.experimentDetails, 'isExperimentActive:', props.isExperimentActive);
        
        // Ensure graphs are attempted if not already initialized by the immediate watcher,
        // respecting the isExperimentActive state for the decoded chart.
        const details = props.experimentDetails;
        if (details) {
            if (!encodedChart && encodedSignalCanvas.value) {
                // console.log('[ResultsSection] Re-init encoded in nextTick');
                updateGraphs(details.input_txt, details.result_txt); // Call once, updateGraphs handles both
            } else if (!decodedChart && decodedSignalCanvas.value) {
                // console.log('[ResultsSection] Re-init decoded in nextTick');
                updateGraphs(details.input_txt, details.result_txt); // Call once, updateGraphs handles both
            } else {
                // If charts exist, an update might still be needed if watcher didn't catch initial state perfectly.
                // However, the watcher with immediate:true and deep:true should be quite robust.
                // console.log('[ResultsSection] Charts likely initialized by watcher, or conditions not met for re-init in nextTick.');
                 updateGraphs(details.input_txt, details.result_txt); // A final safety update call
            }
        } else {
            // console.log('[ResultsSection] No experimentDetails in nextTick, ensuring graphs are cleared.');
            updateGraphs(null, null); // Ensure graphs are cleared if no details
        }
    });
});

// Exposer les méthodes pour le composant parent (if any needed, updateResults removed as it's prop driven)
defineExpose({
  // No methods exposed currently
});
</script> 