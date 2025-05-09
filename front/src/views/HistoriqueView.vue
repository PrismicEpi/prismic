<script setup>
import { ref, onMounted, computed } from 'vue';
import ExperimentCard from '@/components/historique/ExperimentCard.vue';
import Pagination from '@/components/historique/Pagination.vue';

// État de chargement, pagination et erreur
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const totalExperiments = ref(0);
const experiments = ref([]);

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
      minute: '2-digit'
    };
    
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch (err) {
    console.error('Erreur lors du formatage de la date:', err);
    return 'Date invalide';
  }
};

// Fonction pour récupérer les expériences depuis l'API
const fetchExperiments = async () => {
  loading.value = true;
  error.value = null;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  try {
    const response = await fetch(`${apiUrl}/experiments`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Format de données incorrect: les données ne sont pas un tableau');
    }
    
    // Mapper les données de l'API au format attendu
    const formattedData = data.map(item => ({
      id: item.experiment_id,
      date: formatDate(item.experiment_date_start),
      rawDate: item.experiment_date_start,
      character: item.input_txt || '-',
      result: item.result_txt || '-',
      voltage: item.voltage_tension || '0',
      frequency: item.frequency || '0',
      successRate: Math.round((item.success_rate || 0) * 100),
      duration: `${item.duration_sec || 0}s`,
      status: getStatusFromSuccessRate(item.success_rate),
      laser_power: item.laser_power || '0',
      rawData: item
    }));
    
    // Trier les expériences par date (plus récentes en premier)
    formattedData.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    
    totalExperiments.value = formattedData.length;
    experiments.value = formattedData;
    
  } catch (err) {
    console.error('Erreur lors de la récupération des expériences:', err);
    error.value = `Erreur: ${err.message}`;
    experiments.value = [];
  } finally {
    loading.value = false;
  }
};

// Fonction utilitaire pour déterminer le statut en fonction du taux de réussite
const getStatusFromSuccessRate = (successRate) => {
  if (!successRate && successRate !== 0) return 'partial';
  if (successRate >= 0.9) return 'success';
  if (successRate >= 0.7) return 'partial';
  return 'failed';
};

// Calculer les expériences à afficher sur la page courante
const paginatedExperiments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return experiments.value.slice(start, end);
});

// Gérer le changement de page
const handlePageChange = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Ouvrir le détail d'une expérience dans un nouvel onglet
const openExperimentDetail = (experimentId) => {
  window.open(`/experience/${experimentId}`, '_blank');
};

// Charger les données au montage du composant
onMounted(() => {
  fetchExperiments();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Historique des Expériences</h1>
      <button 
        @click="fetchExperiments" 
        class="px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center"
        :disabled="loading"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualiser
      </button>
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="bg-[#1A1C23] rounded-lg shadow-lg p-12 text-center">
      <svg class="animate-spin h-12 w-12 text-[#7E3AF2] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-[#E2E8F0] text-lg">Chargement des expériences...</p>
    </div>
    
    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-[#1A1C23] rounded-lg shadow-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-400 text-lg mb-2">Erreur de chargement</p>
      <p class="text-[#E2E8F0]">{{ error }}</p>
      <button 
        @click="fetchExperiments" 
        class="mt-6 px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
      >
        Réessayer
      </button>
    </div>
    
    <!-- Pas d'expériences -->
    <div v-else-if="experiments.length === 0" class="bg-[#1A1C23] rounded-lg shadow-lg p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#E2E8F0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <p class="text-[#E2E8F0] text-lg">Aucune expérience trouvée</p>
    </div>
    
    <!-- Liste des expériences -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ExperimentCard 
        v-for="experiment in paginatedExperiments" 
        :key="experiment.id"
        :experiment="experiment"
        @click="$router.push(`/experience/${experiment.id}`)"
      />
    </div>
    
    <!-- Pagination -->
    <Pagination 
      v-if="experiments.length > 0"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalExperiments / itemsPerPage)"
      @page-change="handlePageChange"
      class="mt-8"
    />
  </div>
</template>

