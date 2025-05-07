<template>
    <div>
        <h2 class="text-2xl font-bold text-white mb-4">Nouvelle Expérience</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Carte Configuration -->
            <ConfigurationCard ref="configCard" @start-experiment="handleStartExperiment" />

            <!-- Carte Visualisation Live -->
            <VisualizationCard ref="visualizationCard" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ConfigurationCard from './ConfigurationCard.vue';
import VisualizationCard from './VisualizationCard.vue';

// Références aux composants enfants
const configCard = ref(null);
const visualizationCard = ref(null);

// Gérer le démarrage de l'expérience
const handleStartExperiment = (isRunning) => {
    if (isRunning) {
        visualizationCard.value.setStatus('running');
    } else {
        visualizationCard.value.setStatus('idle');
    }
};

// Exposer les méthodes pour le composant parent
defineExpose({
    configCard,
    visualizationCard
});
</script>