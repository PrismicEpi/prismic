<script setup>
import { ref, onMounted } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import NewExperimentSection from '@/components/experience/NewExperimentSection.vue';
import ResultsSection from '@/components/experience/ResultsSection.vue';
import RecentExperimentsSection from '@/components/experience/RecentExperimentsSection.vue';

// Références aux composants
const newExperimentSection = ref(null);
const resultsSection = ref(null);

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
});
</script>

<template>
    <MainLayout>
        <div class="container mx-auto">
            <!-- Section Nouvelle Expérience -->
            <NewExperimentSection ref="newExperimentSection" />

            <!-- Section Résultats -->
            <ResultsSection ref="resultsSection" />

            <!-- Section Expériences Récentes -->
            <RecentExperimentsSection />
        </div>
    </MainLayout>
</template>
