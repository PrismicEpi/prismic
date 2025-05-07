<template>
    <div class="mt-8">
        <h2 class="text-2xl font-bold text-white mb-4">Résultats</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Graphiques côte à côte -->
            <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg">
                <h3 class="text-xl font-semibold mb-4 text-white">Signal Encodé</h3>
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
                            <div class="text-[#7E3AF2]">→</div>
                            <div class="bg-[#1A1C23] p-3 rounded-lg text-center w-16">
                                <div class="text-xs text-[#E2E8F0] mb-1">Reçu</div>
                                <div class="text-2xl font-bold text-white">{{ receivedCharacter }}</div>
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
                                    <circle cx="18" cy="18" r="16" fill="none" stroke="#1A1C23" stroke-width="2">
                                    </circle>
                                    <circle cx="18" cy="18" r="16" fill="none" :stroke="successRateColor"
                                        stroke-width="2" stroke-dasharray="100" :stroke-dashoffset="100 - successRate"
                                        transform="rotate(-90 18 18)"></circle>
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center text-xs font-medium"
                                    :class="successRateTextColor">
                                    {{ successRateLabel }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Durée de conservation -->
                    <div class="bg-[#232631] p-4 rounded-lg">
                        <div class="text-sm font-medium text-[#E2E8F0] mb-2">Durée de conservation</div>
                        <div class="flex items-center justify-between">
                            <div class="text-3xl font-bold text-white">{{ retentionTime }}</div>
                            <div class="text-sm text-[#E2E8F0]">heures</div>
                        </div>
                        <div class="mt-2 h-2 bg-[#1A1C23] rounded-full overflow-hidden">
                            <div class="h-full bg-[#7E3AF2]" :style="{ width: `${retentionPercentage}%` }"></div>
                        </div>
                    </div>
                </div>

                <!-- Boutons d'action -->
                <div class="flex flex-wrap gap-3 mt-6">
                    <button
                        class="px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Télécharger
                    </button>
                    <button
                        class="px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Itérer
                    </button>
                    <button
                        class="px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Voir dans l'historique
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Chart from 'chart.js/auto';

// Références pour les canvas
const encodedSignalCanvas = ref(null);
const decodedSignalCanvas = ref(null);

// Données des résultats
const sentCharacter = ref('A');
const receivedCharacter = ref('A');
const successRate = ref(95);
const retentionTime = ref(48);

// Calculer le pourcentage de rétention (max 72 heures)
const retentionPercentage = computed(() => {
    return Math.min(100, (retentionTime.value / 72) * 100);
});

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

// Initialiser les graphiques
onMounted(() => {
    // Graphique du signal encodé
    const encodedCtx = encodedSignalCanvas.value.getContext('2d');
    new Chart(encodedCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 100 }, (_, i) => i),
            datasets: [{
                label: 'Signal encodé',
                data: generateEncodedSignal(),
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
            }
        }
    });

    // Graphique du signal décodé
    const decodedCtx = decodedSignalCanvas.value.getContext('2d');
    new Chart(decodedCtx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 100 }, (_, i) => i),
            datasets: [{
                label: 'Signal décodé',
                data: generateDecodedSignal(),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
            }
        }
    });
});

// Générer des données simulées pour le signal encodé
const generateEncodedSignal = () => {
    // Simuler un signal pour le caractère 'A' (ASCII 65)
    const baseValue = 65;
    return Array.from({ length: 100 }, (_, i) => {
        const phase = i % 25;
        if (phase < 5) return 0;
        if (phase < 15) return baseValue + Math.random() * 5;
        return 0;
    });
};

// Générer des données simulées pour le signal décodé
const generateDecodedSignal = () => {
    // Simuler un signal décodé légèrement différent
    const baseValue = 65;
    return Array.from({ length: 100 }, (_, i) => {
        const phase = i % 25;
        if (phase < 5) return 0;
        if (phase < 15) return baseValue + Math.random() * 8 - 2;
        return 0;
    });
};

// Méthode pour mettre à jour les résultats
const updateResults = (results) => {
    if (results) {
        sentCharacter.value = results.sentCharacter || sentCharacter.value;
        receivedCharacter.value = results.receivedCharacter || receivedCharacter.value;
        successRate.value = results.successRate || successRate.value;
        retentionTime.value = results.retentionTime || retentionTime.value;
    }
};

// Exposer les méthodes pour le composant parent
defineExpose({
    updateResults
});
</script>