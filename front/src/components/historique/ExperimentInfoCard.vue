<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  experiment: {
    type: Object,
    required: true
  }
});

// Déterminer la classe et le texte pour le statut
const getStatusInfo = (status) => {
  const statusMap = {
    'started': { text: 'Démarré', class: 'bg-blue-900 text-blue-300' },
    'completed': { text: 'Terminé', class: 'bg-green-900 text-green-300' },
    'failed': { text: 'Échoué', class: 'bg-red-900 text-red-300' },
    'paused': { text: 'En pause', class: 'bg-yellow-900 text-yellow-300' },
    'cancelled': { text: 'Annulé', class: 'bg-gray-900 text-gray-300' }
  };
  
  return statusMap[status] || { text: 'Inconnu', class: 'bg-gray-900 text-gray-300' };
};
</script>

<template>
  <div class="bg-[#1A1C23] rounded-lg shadow-lg overflow-hidden">
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-bold text-white">Informations générales</h2>
        <!-- <span 
          class="px-2 py-1 text-xs rounded-full" 
          :class="getStatusInfo(experiment.status).class"
        >
          {{ getStatusInfo(experiment.status).text }}
        </span> -->
      </div>
      
      <div class="space-y-4">
        <!-- ID de l'expérience -->
        <div class="bg-[#232631] rounded-md p-3">
          <p class="text-xs text-[#7E3AF2] font-medium mb-1">ID de l'expérience</p>
          <p class="text-sm text-[#E2E8F0] truncate">{{ experiment.id }}</p>
        </div>
        
        <!-- Caractère d'entrée et résultat -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-[#232631] rounded-md p-3">
            <p class="text-xs text-[#7E3AF2] font-medium mb-1">Caractère d'entrée</p>
            <p class="text-lg text-white font-medium text-center">{{ experiment.character }}</p>
          </div>
          <div class="bg-[#232631] rounded-md p-3">
            <p class="text-xs text-[#7E3AF2] font-medium mb-1">Résultat</p>
            <p class="text-lg text-white font-medium text-center">{{ experiment.result }}</p>
          </div>
        </div>
        
        <!-- Dates et durée -->
        <div class="bg-[#232631] rounded-md p-3">
          <p class="text-xs text-[#7E3AF2] font-medium mb-1">Date de début</p>
          <p class="text-sm text-[#E2E8F0]">{{ experiment.dateStart }}</p>
        </div>
        
        <div class="bg-[#232631] rounded-md p-3">
          <p class="text-xs text-[#7E3AF2] font-medium mb-1">Date de fin</p>
          <p class="text-sm text-[#E2E8F0]">{{ experiment.dateEnd }}</p>
        </div>
        
        <div class="bg-[#232631] rounded-md p-3">
          <p class="text-xs text-[#7E3AF2] font-medium mb-1">Durée</p>
          <p class="text-sm text-[#E2E8F0]">{{ experiment.duration }}</p>
        </div>
      </div>
      
      <!-- Taux de réussite -->
      <div class="mt-6">
        <div class="flex justify-between text-sm text-[#E2E8F0] mb-1">
          <span>Taux de réussite</span>
          <span>{{ experiment.successRate }}%</span>
        </div>
        <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
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
      </div>
    </div>
  </div>
</template> 