<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ExperimentInfoCard from '@/components/historique/ExperimentInfoCard.vue';
import ExperimentGraph from '@/components/historique/ExperimentGraph.vue';
import ExperimentParameters from '@/components/historique/ExperimentParameters.vue';

const route = useRoute();
const experimentId = route.params.id;

const experiment = ref(null);
const loading = ref(true);
const error = ref(null);

// Formater une date en format lisible
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    };
    
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch (err) {
    console.error('Erreur lors du formatage de la date:', err);
    return 'Date invalide';
  }
};

// Calculer la durée en format lisible entre deux dates
const calculateDuration = (startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Durée indisponible';
    }
    
    const diff = Math.abs(end - start) / 1000; // en secondes
    
    if (diff < 60) {
      return `${Math.round(diff)} secondes`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} min ${Math.round(diff % 60)} sec`;
    } else {
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      return `${hours}h ${minutes}min`;
    }
  } catch (err) {
    console.error('Erreur lors du calcul de la durée:', err);
    return 'Durée indisponible';
  }
};

// Fonction pour récupérer les détails de l'expérience
const fetchExperimentDetails = async () => {
  loading.value = true;
  error.value = null;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  try {
    const response = await fetch(`${apiUrl}/experiments`);

    console.log(response);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Format de données incorrect: les données ne sont pas un tableau');
    }
    
    // Trouver l'expérience avec l'ID correspondant
    const foundExperiment = data.find(item => item.experiment_id === experimentId);
    
    if (!foundExperiment) {
      throw new Error(`Expérience avec l'ID ${experimentId} non trouvée`);
    }
    
    // Formater les données
    experiment.value = {
      id: foundExperiment.experiment_id,
      character: foundExperiment.input_txt || '-',
      result: foundExperiment.result_txt || '-',
      dateStart: formatDate(foundExperiment.experiment_date_start),
      dateEnd: formatDate(foundExperiment.experiment_date_end),
      startTimestamp: foundExperiment.experiment_date_start,
      endTimestamp: foundExperiment.experiment_date_end,
      duration: calculateDuration(foundExperiment.experiment_date_start, foundExperiment.experiment_date_end),
      durationSeconds: foundExperiment.duration_sec || 0,
      voltage: foundExperiment.voltage_tension || 0,
      frequency: foundExperiment.frequency || 0,
      humidity: foundExperiment.humidity || 0,
      temperature: foundExperiment.temperature || 0,
      laserPower: foundExperiment.laser_power || 0,
      successRate: Math.round((foundExperiment.success_rate || 0) * 100),
      status: foundExperiment.status || 'unknown',
      report: foundExperiment.report ? true : null,
      reportType: foundExperiment.report_type || null,
      graphHistory: foundExperiment.graph_history || [],
      rawData: { ...foundExperiment, report: '[Binary data]' }
    };
    
  } catch (err) {
    console.error('Erreur lors de la récupération des détails de l\'expérience:', err);
    error.value = `Erreur: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Charger les données au montage du composant
onMounted(() => {
  fetchExperimentDetails();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <!-- <button 
          @click="$router.push('/experience')" 
          class="mr-4 text-[#7E3AF2] hover:text-[#6C2BD9] flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour 
        </button>-->
        <h1 class="text-3xl font-bold text-white">Détails de l'Expérience</h1>
      </div>
      <!-- <button 
        @click="fetchExperimentDetails" 
        class="px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center"
        :disabled="loading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button> -->
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="bg-[#1A1C23] rounded-lg shadow-lg p-12 text-center">
      <svg class="animate-spin h-12 w-12 text-[#7E3AF2] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-[#E2E8F0] text-lg">Chargement des détails de l'expérience...</p>
    </div>
    
    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-[#1A1C23] rounded-lg shadow-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-400 text-lg mb-2">Erreur de chargement</p>
      <p class="text-[#E2E8F0]">{{ error }}</p>
      <button 
        @click="fetchExperimentDetails" 
        class="mt-6 px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
      >
        Réessayer
      </button>
    </div>
    
    <!-- Détails de l'expérience -->
    <div v-else-if="experiment" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informations générales -->
      <div class="lg:col-span-1">
        <ExperimentInfoCard :experiment="experiment" />
      </div>
      
      <!-- Graphique -->
      <div class="lg:col-span-2">
        <ExperimentGraph 
          :graph-data="experiment.graphHistory" 
          :success-rate="experiment.successRate"
        />
      </div>
      
      <!-- Paramètres -->
      <div class="lg:col-span-3">
        <ExperimentParameters :experiment="experiment" />
      </div>
    </div>
  </div>
</template> 