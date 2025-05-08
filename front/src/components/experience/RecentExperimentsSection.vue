<template>
  <div class="mt-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold text-white">Expériences Récentes</h2>
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
    
    <div class="bg-[#1A1C23] rounded-lg shadow-lg overflow-hidden">
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
            <tr v-for="(experiment, index) in recentExperiments" :key="index" class="hover:bg-[#232631]">
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
                <button class="text-[#7E3AF2] hover:text-[#6C2BD9] mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <!-- <button class="text-[#7E3AF2] hover:text-[#6C2BD9]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Données des expériences récentes
const recentExperiments = ref([
  {
    date: '2023-06-15 14:32',
    character: 'A',
    voltage: '1.7',
    frequency: '50',
    successRate: 100,
    duration: '30s',
    status: 'success'
  },
  {
    date: '2023-06-15 13:45',
    character: 'B',
    voltage: '1.8',
    frequency: '55',
    successRate: 85,
    duration: '28s',
    status: 'partial'
  },
  {
    date: '2023-06-15 11:20',
    character: 'C',
    voltage: '1.5',
    frequency: '45',
    successRate: 92,
    duration: '32s',
    status: 'success'
  },
  {
    date: '2023-06-14 16:15',
    character: 'X',
    voltage: '1.9',
    frequency: '60',
    successRate: 65,
    duration: '25s',
    status: 'failed'
  },
  {
    date: '2023-06-14 10:08',
    character: 'Z',
    voltage: '1.7',
    frequency: '50',
    successRate: 98,
    duration: '30s',
    status: 'success'
  }
]);
</script> 