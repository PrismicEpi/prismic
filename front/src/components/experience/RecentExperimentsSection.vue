<template>
  <div class="mt-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-white">Expériences Récentes</h2>
      <div class="flex items-center">
        <button 
          @click="fetchExperiments" 
          class="text-[#7E3AF2] hover:text-[#6C2BD9] flex items-center mr-4"
          :disabled="loading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span class="ml-1">Actualiser</span>
        </button>
        <router-link 
          to="/historique" 
          class="text-[#7E3AF2] hover:text-[#6C2BD9] flex items-center"
        >
          Voir tout
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
    </div>
    
    <!-- État de chargement -->
    <div v-if="loading" class="bg-[#1A1C23] rounded-lg shadow-lg p-6 text-center">
      <svg class="animate-spin h-8 w-8 text-[#7E3AF2] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-[#E2E8F0]">Chargement des expériences...</p>
    </div>
    
    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-[#1A1C23] rounded-lg shadow-lg p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-400 mb-2">Erreur de chargement</p>
      <p class="text-[#E2E8F0] text-sm">{{ error }}</p>
      <button 
        @click="fetchExperiments" 
        class="mt-4 px-4 py-2 bg-[#232631] text-white rounded-md hover:bg-[#2D3748] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
      >
        Réessayer
      </button>
    </div>
    
    <!-- Pas d'expériences -->
    <div v-else-if="recentExperiments.length === 0" class="bg-[#1A1C23] rounded-lg shadow-lg p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#E2E8F0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <p class="text-[#E2E8F0]">Aucune expérience récente trouvée</p>
    </div>
    
    <!-- Tableau des expériences -->
    <div v-else class="bg-[#1A1C23] rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-[#232631]">
              <th class="px-6 py-3 text-left text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Caractère</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Paramètres</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Taux de réussite</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Durée</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-[#E2E8F0] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#232631]">
            <tr v-for="(experiment, index) in sortedExperiments" :key="index" class="hover:bg-[#232631]">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">{{ experiment.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{{ experiment.character }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">
                <div class="flex space-x-2">
                  <span class="px-2 py-1 bg-[#232631] rounded text-xs">{{ experiment.voltage }}V</span>
                  <span class="px-2 py-1 bg-[#232631] rounded text-xs">{{ experiment.frequency }}Hz</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="h-2 w-16 bg-gray-700 rounded-full overflow-hidden mr-2"
                  >
                    <div 
                      class="h-full rounded-full" 
                      :class="{
                        'bg-green-500': experiment.successRate >= 90,
                        'bg-yellow-500': experiment.successRate >= 70 && experiment.successRate < 90,
                        'bg-red-500': experiment.successRate < 70
                      }"
                      :style="{ width: `${experiment.successRate}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-[#E2E8F0]">{{ experiment.successRate }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#E2E8F0]">{{ experiment.duration }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full" 
                  :class="{
                    'bg-green-900 text-green-300': experiment.status === 'success',
                    'bg-yellow-900 text-yellow-300': experiment.status === 'partial',
                    'bg-red-900 text-red-300': experiment.status === 'failed'
                  }"
                >
                  <span class="mr-1">
                    {{ 
                      experiment.status === 'success' ? '✓' : 
                      experiment.status === 'partial' ? '⚠' : '✕' 
                    }}
                  </span>
                  {{ 
                    experiment.status === 'success' ? 'Succès' : 
                    experiment.status === 'partial' ? 'Partiel' : 'Échec' 
                  }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="$router.push(`/experience/${experiment.id}`)"
                  class="text-[#7E3AF2] hover:text-[#6C2BD9] mr-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// État de chargement et d'erreur
const loading = ref(false);
const error = ref(null);

// Données des expériences récentes
const recentExperiments = ref([]);

// Trier les expériences par date (plus récentes en premier)
const sortedExperiments = computed(() => {
  console.log(recentExperiments.value);
  return [...recentExperiments.value].sort((a, b) => {
    return new Date(b.experiment_date_start) - new Date(a.experiment_date_start);
  });
});

// Formater une date en format lisible
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Options de formatage
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
  
  try {
    const response = await fetch('https://prototype.prismic.fr/api/experiments');

    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();

    console.log(data);
    
    if (!Array.isArray(data)) {
      throw new Error('Format de données incorrect: les données ne sont pas un tableau');
    }
    
    // Mapper les données de l'API au format attendu
    recentExperiments.value = data.map(item => ({
      _rawDate: item.experiment_date, // Conserver la date brute pour le tri
      date: formatDate(item.experiment_date_start),
      character: item.input_txt || '-',
      voltage: item.voltage_tension || '0',
      frequency: item.frequency || '0',
      successRate: Math.round((item.success_rate || 0) * 100),
      duration: `${item.duration_sec || 0}s`,
      status: getStatusFromSuccessRate(item.success_rate),
      id: item.experiment_id
    })).slice(0, 5); // Limiter aux 5 plus récentes expériences
    
  } catch (err) {
    console.error('Erreur lors de la récupération des expériences:', err);
    error.value = `Erreur: ${err.message}`;
    recentExperiments.value = [];
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

// Charger les données au montage du composant
onMounted(() => {
  fetchExperiments();
});
</script> 