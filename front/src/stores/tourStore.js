import { defineStore } from 'pinia';

export const useTourStore = defineStore('tour', {
  state: () => ({
    hasSeenTour: false,
    isActive: false,
  }),
  actions: {
    markTourAsSeen() {
      this.hasSeenTour = true;
    },
    setTourActive(isActive) {
      this.isActive = isActive;
    },
    resetTourState() {
      this.hasSeenTour = false;
      this.isActive = false;
    },
    // Completely clear the tour state from localStorage and reset to defaults
    clearTourStorage() {
      this.$reset();
      try {
        localStorage.removeItem('tour');
      } catch (e) {
        console.error('Could not clear tour storage', e);
      }
    }
  },
  persist: true
}); 