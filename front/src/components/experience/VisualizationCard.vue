<template>
    <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg h-full">
        <h3 class="text-xl font-semibold mb-4 text-white">Visualisation Live</h3>

        <div class="space-y-4">
            <!-- État de l'expérience -->
            <div class="flex items-center space-x-2">
                <div class="text-sm font-medium text-[#E2E8F0]">État:</div>
                <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" :class="{
                        'bg-green-500': status === 'running',
                        'bg-yellow-500': status === 'ready',
                        'bg-red-500': status === 'error',
                        'bg-gray-500': status === 'idle'
                    }"></div>
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
                <div v-if="status !== 'running'"
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div class="text-center">
                        <p class="text-[#E2E8F0] mb-2">Aucune donnée disponible</p>
                        <p class="text-sm text-gray-400">Lancez une expérience pour voir les données en temps réel</p>
                    </div>
                </div>
            </div>

            <!-- Données des capteurs -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-[#232631] p-3 rounded-lg">
                    <div class="text-sm font-medium text-[#E2E8F0] mb-1">Intensité</div>
                    <div class="text-xl font-bold text-white">{{ intensity }} mW</div>
                </div>
                <div class="bg-[#232631] p-3 rounded-lg">
                    <div class="text-sm font-medium text-[#E2E8F0] mb-1">Stabilité</div>
                    <div class="text-xl font-bold text-white">{{ stability }}%</div>
                </div>
                <div class="bg-[#232631] p-3 rounded-lg">
                    <div class="text-sm font-medium text-[#E2E8F0] mb-1">Température</div>
                    <div class="text-xl font-bold text-white">{{ temperature }}°C</div>
                </div>
                <div class="bg-[#232631] p-3 rounded-lg">
                    <div class="text-sm font-medium text-[#E2E8F0] mb-1">Durée</div>
                    <div class="text-xl font-bold text-white">{{ duration }}s</div>
                </div>
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

// État et données
const status = ref('idle'); // 'idle', 'ready', 'running', 'error'
const intensity = ref(0);
const stability = ref(0);
const temperature = ref(25);
const duration = ref(0);

// Variables pour les graphiques
let mainChart = null;
let expectedSignalChart = null;

// Données simulées pour le graphique
const generateRandomData = (count, min, max) => {
    return Array.from({ length: count }, () => Math.random() * (max - min) + min);
};

// Initialiser les graphiques
onMounted(() => {
    // Graphique principal
    const mainCtx = chartCanvas.value.getContext('2d');
    mainChart = new Chart(mainCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 50 }, (_, i) => i),
            datasets: [{
                label: 'Intensité lumineuse',
                data: generateRandomData(50, 0, 0),
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
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#E2E8F0'
                    }
                },
                x: {
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
                data: [0, 0, 5, 10, 15, 20, 25, 30, 25, 20, 15, 10, 5, 0, 0, 0, 0, 0, 0, 0],
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
        const data = mainChart.data.datasets[0].data;
        data.shift();
        data.push(Math.random() * 30);
        mainChart.update();

        // Mettre à jour les métriques
        intensity.value = (Math.random() * 10 + 20).toFixed(1);
        stability.value = (Math.random() * 10 + 85).toFixed(1);
        temperature.value = (Math.random() * 2 + 24).toFixed(1);
        duration.value = (duration.value + 1);
    }
};

// Observer les changements d'état
watch(status, (newStatus) => {
    if (newStatus === 'running') {
        // Réinitialiser les données
        duration.value = 0;

        // Démarrer la mise à jour en temps réel
        const interval = setInterval(() => {
            updateChartData();
        }, 1000);

        // Simuler une fin d'expérience après 30 secondes
        setTimeout(() => {
            clearInterval(interval);
            status.value = 'idle';
        }, 30000);
    }
});

// Exposer les méthodes pour le composant parent
defineExpose({
    setStatus: (newStatus) => {
        status.value = newStatus;
    }
});
</script>