<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  experiment: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div 
    class="bg-[#1A1C23] rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    @click="$emit('click')"
  >
    <div class="p-5">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-bold text-white">{{ experiment.character }}</h3>
        <span 
          class="px-2 py-1 text-xs rounded-full" 
          :class="{
            'bg-green-900 text-green-300': experiment.status === 'success',
            'bg-yellow-900 text-yellow-300': experiment.status === 'partial',
            'bg-red-900 text-red-300': experiment.status === 'failed'
          }"
        >
          {{ 
            experiment.status === 'success' ? 'Succès' : 
            experiment.status === 'partial' ? 'Partiel' : 'Échec' 
          }}
        </span>
      </div>
      
      <div class="text-sm text-[#E2E8F0] mb-4">
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ experiment.date }}
        </div>
        
        <div class="flex items-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-[#7E3AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Durée: {{ experiment.duration }}
        </div>
      </div>
      
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-[#E2E8F0] mb-1">
            <span>Taux de réussite</span>
            <span>{{ experiment.successRate }}%</span>
          </div>
          <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
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
    
    <div class="bg-[#232631] p-4 flex justify-between items-center border-t border-[#2D3748]">
      <div class="flex space-x-2">
        <span class="px-2 py-1 bg-[#1A1C23] rounded text-xs text-[#E2E8F0]">{{ experiment.voltage }}V</span>
        <span class="px-2 py-1 bg-[#1A1C23] rounded text-xs text-[#E2E8F0]">{{ experiment.frequency }}Hz</span>
        <span class="px-2 py-1 bg-[#1A1C23] rounded text-xs text-[#E2E8F0]">{{ experiment.laser_power }} mW</span>
      </div>
      
      <button class="text-[#7E3AF2] hover:text-[#6C2BD9]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template> 