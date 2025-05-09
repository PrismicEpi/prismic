<script setup>
import { defineProps, onMounted, ref, watch } from 'vue';

const props = defineProps({
  graphData: {
    type: Array,
    required: true
  },
  successRate: {
    type: Number,
    required: true
  }
});

const chartCanvas = ref(null);
let chart = null;

// Fonction pour créer le graphique
const createChart = () => {
  if (!chartCanvas.value || !props.graphData || props.graphData.length === 0) return;
  
  const ctx = chartCanvas.value.getContext('2d');
  
  // Préparer les données pour le graphique
  const labels = props.graphData.map(point => point[0]);
  const data = props.graphData.map(point => point[1]);
  
  // Définir la couleur en fonction du taux de réussite
  let chartColor = '#EF4444'; // rouge par défaut (échec)
  if (props.successRate >= 90) {
    chartColor = '#10B981'; // vert (succès)
  } else if (props.successRate >= 70) {
    chartColor = '#F59E0B'; // jaune (partiel)
  }
  
  // Charger Chart.js depuis CDN si nécessaire
  if (typeof Chart === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
    script.onload = () => {
      initializeChart(ctx, labels, data, chartColor);
    };
    document.head.appendChild(script);
  } else {
    initializeChart(ctx, labels, data, chartColor);
  }
};

// Initialiser le graphique une fois Chart.js chargé
const initializeChart = (ctx, labels, data, chartColor) => {
  // Si un graphique existe déjà, le détruire
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Progression',
        data: data,
        borderColor: chartColor,
        backgroundColor: `${chartColor}20`,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: chartColor,
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#232631',
          titleColor: '#E2E8F0',
          bodyColor: '#E2E8F0',
          padding: 10,
          borderColor: '#2D3748',
          borderWidth: 1,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#A0AEC0'
          },
          title: {
            display: true,
            text: 'Temps (secondes)',
            color: '#A0AEC0'
          }
        },
        y: {
          grid: {
            color: '#2D374820',
            drawBorder: false
          },
          ticks: {
            color: '#A0AEC0'
          },
          title: {
            display: true,
            text: 'Valeur',
            color: '#A0AEC0'
          }
        }
      }
    }
  });
};

// Observer les changements dans les données du graphique
watch(() => props.graphData, () => {
  createChart();
}, { deep: true });

// Créer le graphique au montage du composant
onMounted(() => {
  createChart();
  
  // Recréer le graphique lors du redimensionnement de la fenêtre
  window.addEventListener('resize', createChart);
  
  // Nettoyer lors de la destruction du composant
  return () => {
    window.removeEventListener('resize', createChart);
    if (chart) {
      chart.destroy();
    }
  };
});
</script>

<template>
  <div class="bg-[#1A1C23] rounded-lg shadow-lg overflow-hidden">
    <div class="p-6">
      <h2 class="text-xl font-bold text-white mb-4">Graphique de progression</h2>
      
      <div v-if="graphData && graphData.length > 0" class="h-80">
        <canvas ref="chartCanvas"></canvas>
      </div>
      
      <div v-else class="h-80 flex items-center justify-center">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#4A5568] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p class="text-[#E2E8F0]">Aucune donnée de graphique disponible</p>
        </div>
      </div>
    </div>
  </div>
</template> 