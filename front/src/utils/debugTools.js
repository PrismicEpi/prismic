/**
 * Debug tools for the Prismic application
 * These functions can be called from the browser console
 */

// Function to clear tour state and storage
export function resetTourState() {
  try {
    // Clear localStorage entry
    localStorage.removeItem('tour');
    
    // Also try to reset any Pinia state if available
    if (window.__pinia) {
      const tourStore = window.__pinia.state.value.tour;
      if (tourStore) {
        tourStore.hasSeenTour = false;
        tourStore.isActive = false;
      }
    }
    
    console.log('✅ Tour state reset successfully. Refresh the page to see changes.');
    return true;
  } catch (error) {
    console.error('❌ Failed to reset tour state:', error);
    return false;
  }
}

// Function to start the tour programmatically
export function startTour() {
  try {
    // Reset state first
    resetTourState();
    
    // Find TourGuide component
    const tourGuideEl = document.querySelector('.tour-guide-component');
    if (tourGuideEl && tourGuideEl.__vueParentComponent) {
      const tourGuideComponent = tourGuideEl.__vueParentComponent.ctx;
      if (tourGuideComponent.forceStartTour) {
        tourGuideComponent.forceStartTour();
        console.log('✅ Tour started manually.');
        return true;
      }
    }
    
    console.warn('⚠️ Could not find TourGuide component. Tour not started.');
    return false;
  } catch (error) {
    console.error('❌ Failed to start tour:', error);
    return false;
  }
}

// Expose functions to window for console access
if (typeof window !== 'undefined') {
  window.resetTourState = resetTourState;
  window.startTour = startTour;
} 