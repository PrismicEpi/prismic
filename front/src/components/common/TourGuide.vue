<!-- TourGuide.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getExperienceTour, resetExperienceTour } from '@/utils/tour.js';
import { useTourStore } from '@/stores/tourStore';
import { useToast } from 'vue-toastification';

const route = useRoute();
const tourStore = useTourStore();
const toast = useToast();

// Initialize the tour when the component is mounted
onMounted(() => {
  // Reset any invalid state first (if isActive is true but no tour is running)
  if (tourStore.isActive) {
    tourStore.setTourActive(false);
  }
  
  // Start the tour automatically if on the ExperienceView page and hasn't seen it before
  if (route.path === '/' && !tourStore.hasSeenTour) {
    startTour();
  }
});

// Clean up the tour when the component is unmounted
onBeforeUnmount(() => {
  resetExperienceTour();
  // Ensure the active state is reset when component is unmounted
  if (tourStore.isActive) {
    tourStore.setTourActive(false);
  }
});

// Start the tour
const startTour = () => {
  const tour = getExperienceTour();
  
  // Only start if not already active
  if (!tourStore.isActive) {
    tourStore.setTourActive(true);
    
    // Add event listeners
    tour.on('complete', () => {
      tourStore.setTourActive(false);
      tourStore.markTourAsSeen();
    });
    
    tour.on('cancel', () => {
      tourStore.setTourActive(false);
      // Even if cancelled, mark as seen to avoid showing again automatically
      tourStore.markTourAsSeen();
    });
    
    // Add a catch-all error handler to prevent stuck states
    tour.on('error', () => {
      tourStore.setTourActive(false);
    });
    
    // Start the tour
    try {
      tour.start();
    } catch (error) {
      console.error("Error starting tour:", error);
      tourStore.setTourActive(false);
    }
  }
};

// Force start tour regardless of state
const forceStartTour = () => {
  // Reset the store state first
  tourStore.setTourActive(false);
  
  // Then start tour
  const tour = getExperienceTour();
  resetExperienceTour(); // Reset any existing tour
  startTour();
};

// Reset tour (will show it again on next visit)
const resetTour = () => {
  tourStore.resetTourState();
  toast.info('La visite guidée sera affichée lors de votre prochaine visite.');
};

// Expose the methods to the parent component
defineExpose({
  startTour,
  forceStartTour,
  resetTour
});
</script>

<template>
  <div class="tour-guide-component">
    <!-- Tour button -->
    <button
      @click="forceStartTour"
      class="fixed bottom-5 right-5 z-50 p-3 bg-[#7E3AF2] text-white rounded-full shadow-lg hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
      title="Démarrer la visite guidée"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  </div>
</template>

<style>
/* Dark theme styles for Shepherd */
.shepherd-element {
  background-color: #1A1C23 !important;
  color: #E2E8F0 !important;
  border: 1px solid #393E46 !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
  z-index: 9999 !important;
}

.shepherd-text {
  color: #E2E8F0 !important;
}

.shepherd-title {
  color: white !important;
}

.shepherd-header {
  background: transparent !important;
  border-bottom: none !important;
}

.shepherd-footer {
  border-top: none !important;
}

.shepherd-arrow:before {
  background-color: #1A1C23 !important;
}

.shepherd-modal-overlay-container {
  background-color: rgba(0, 0, 0, 0.75) !important;
}
</style> 