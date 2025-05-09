<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['page-change']);

// Calculer le nombre de pages visibles
const visiblePages = computed(() => {
  const maxVisiblePages = 5;
  
  if (props.totalPages <= maxVisiblePages) {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }
  
  // Toujours afficher la première et la dernière page
  const pages = [];
  
  // Ajouter les pages autour de la page actuelle
  const sidePages = Math.floor((maxVisiblePages - 2) / 2); // soustraire la première et dernière page
  
  // Déterminer les pages de début et de fin
  let startPage = Math.max(2, props.currentPage - sidePages);
  let endPage = Math.min(props.totalPages - 1, props.currentPage + sidePages);
  
  // Ajuster si on est proche des extrémités
  if (props.currentPage <= sidePages + 1) {
    endPage = maxVisiblePages - 1;
  } else if (props.currentPage >= props.totalPages - sidePages) {
    startPage = props.totalPages - maxVisiblePages + 2;
  }
  
  // Ajouter la première page
  pages.push(1);
  
  // Ajouter ellipsis si nécessaire au début
  if (startPage > 2) {
    pages.push('...');
  }
  
  // Ajouter les pages intermédiaires
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // Ajouter ellipsis si nécessaire à la fin
  if (endPage < props.totalPages - 1) {
    pages.push('...');
  }
  
  // Ajouter la dernière page
  if (props.totalPages > 1) {
    pages.push(props.totalPages);
  }
  
  return pages;
});

// Fonctions pour la navigation
const goToPage = (page) => {
  if (typeof page === 'number' && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const goToPreviousPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1);
  }
};
</script>

<template>
  <div class="flex justify-center">
    <nav class="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
      <!-- Bouton précédent -->
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-[#2D3748] bg-[#1A1C23] text-sm font-medium"
        :class="currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-[#E2E8F0] hover:bg-[#232631]'"
      >
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <!-- Pages -->
      <template v-for="(page, index) in visiblePages" :key="index">
        <span
          v-if="page === '...'"
          class="relative inline-flex items-center px-4 py-2 border border-[#2D3748] bg-[#1A1C23] text-sm font-medium text-gray-500"
        >
          ...
        </span>
        <button
          v-else
          @click="goToPage(page)"
          class="relative inline-flex items-center px-4 py-2 border border-[#2D3748] text-sm font-medium"
          :class="page === currentPage 
            ? 'z-10 bg-[#7E3AF2] border-[#7E3AF2] text-white' 
            : 'bg-[#1A1C23] text-[#E2E8F0] hover:bg-[#232631]'"
        >
          {{ page }}
        </button>
      </template>
      
      <!-- Bouton suivant -->
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-[#2D3748] bg-[#1A1C23] text-sm font-medium"
        :class="currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-[#E2E8F0] hover:bg-[#232631]'"
      >
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </div>
</template> 