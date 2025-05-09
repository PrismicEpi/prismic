<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  experiment: {
    type: Object,
    required: true
  }
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
</script>

<template>
  <div class="bg-[#1A1C23] rounded-lg shadow-lg overflow-hidden">
    <div class="p-6">
      <h2 class="text-xl font-bold text-white mb-6">Paramètres de l'expérience</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Tension -->
        <div class="bg-[#232631] rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-xs text-[#7E3AF2] font-medium">Tension</p>
              <p class="text-lg text-white font-bold">{{ experiment.voltage }} V</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p class="text-xs text-[#A0AEC0]">Tension appliquée pendant l'expérience</p>
        </div>
        
        <!-- Fréquence -->
        <div class="bg-[#232631] rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-xs text-[#7E3AF2] font-medium">Fréquence</p>
              <p class="text-lg text-white font-bold">{{ experiment.frequency }} Hz</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-xs text-[#A0AEC0]">Fréquence d'oscillation utilisée</p>
        </div>
        
        <!-- Puissance du laser -->
        <div class="bg-[#232631] rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-xs text-[#7E3AF2] font-medium">Puissance du laser</p>
              <p class="text-lg text-white font-bold">{{ experiment.laserPower || 'N/A' }} mw</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p class="text-xs text-[#A0AEC0]">Niveau de puissance du laser</p>
        </div>
        
        <!-- Humidité -->
        <div class="bg-[#232631] rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-xs text-[#7E3AF2] font-medium">Humidité</p>
              <p class="text-lg text-white font-bold">{{ experiment.humidity }}%</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p class="text-xs text-[#A0AEC0]">Niveau d'humidité ambiante</p>
        </div>
        
        <!-- Température -->
        <div class="bg-[#232631] rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-xs text-[#7E3AF2] font-medium">Température</p>
              <p class="text-lg text-white font-bold">{{ experiment.temperature }}°C</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p class="text-xs text-[#A0AEC0]">Température ambiante</p>
        </div>
      </div>
      
      <!-- Rapport d'expérience -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold text-white mb-4">Rapport d'expérience</h3>
        
        <div v-if="experiment.report" class="bg-[#232631] rounded-lg p-4">
          <!-- Report Viewer (works for PDF and text) -->
          <div class="w-full">
            <iframe 
              :src="`${apiBaseUrl}/report/${experiment.id}`" 
              class="w-full h-[600px] border-0 rounded" 
              title="Rapport d'expérience"
            ></iframe>
            
            <!-- Download button -->
            <div class="mt-4 flex justify-end">
              <a 
                :href="`${apiBaseUrl}/report/${experiment.id}`" 
                target="_blank" 
                class="px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger le rapport
              </a>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-[#232631] rounded-lg p-4 text-center">
          <p class="text-sm text-[#A0AEC0]">Aucun rapport disponible pour cette expérience</p>
        </div>
      </div>
      
      <!-- Données brutes (pour les développeurs) -->
      <div class="mt-6">
        <div class="flex items-center mb-4">
          <h3 class="text-lg font-semibold text-white mr-2">Données brutes</h3>
          <span class="px-2 py-1 bg-[#232631] rounded text-xs text-[#A0AEC0]">Pour développeurs</span>
        </div>
        
        <div class="bg-[#232631] rounded-lg p-4 overflow-x-auto">
          <pre class="text-xs text-[#E2E8F0]">{{ JSON.stringify(experiment.rawData, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template> 