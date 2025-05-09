<template>
  <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg">
    <h3 class="text-xl font-semibold mb-4 text-white">Configuration</h3>
    
    <div class="space-y-4">
      <!-- Champ pour le caractère à stocker -->
      <div>
        <label for="character" class="block text-sm font-medium text-[#E2E8F0] mb-1">Caractère à stocker</label>
        <input 
          type="text" 
          id="character" 
          v-model="character" 
          maxlength="1"
          class="w-full px-3 py-2 bg-[#232631] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] text-white disabled:opacity-75 disabled:cursor-not-allowed"
          :disabled="isExperimentActive"
        />
      </div>
      
      <!-- Paramètres du laser -->
      <div>
        <h4 class="text-md font-medium text-[#E2E8F0] mb-2">Paramètres du laser</h4>
        
        <div class="space-y-3">
          <div>
            <div class="flex justify-between">
              <label for="voltage" class="block text-sm text-[#E2E8F0]">Voltage</label>
              <span class="text-sm text-[#E2E8F0]">{{ voltage }}V</span>
            </div>
            <input 
              type="range" 
              id="voltage" 
              v-model="voltage" 
              min="0" 
              max="5" 
              step="0.1"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2] disabled:opacity-75 disabled:cursor-not-allowed"
              :disabled="isExperimentActive"
            />
          </div>
          
          <div>
            <div class="flex justify-between">
              <label for="frequency" class="block text-sm text-[#E2E8F0]">Fréquence</label>
              <span class="text-sm text-[#E2E8F0]">{{ frequency }} Hz</span>
            </div>
            <input 
              type="range" 
              id="frequency" 
              v-model="frequency" 
              min="1" 
              max="100" 
              step="1"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2] disabled:opacity-75 disabled:cursor-not-allowed"
              :disabled="isExperimentActive"
            />
          </div>
        </div>
      </div>
      
      <!-- Paramètres de la cavité optique -->
      <div>
        <h4 class="text-md font-medium text-[#E2E8F0] mb-2">Paramètres de l'environnement</h4>
        
        <div class="space-y-3">
          <div>
            <div class="flex justify-between">
              <label for="temperature" class="block text-sm text-[#E2E8F0]">Température</label>
              <span class="text-sm text-[#E2E8F0]">{{ temperature }}°C</span>
            </div>
            <input 
              type="range" 
              id="temperature" 
              v-model.number="temperature" 
              min="20" 
              max="40" 
              step="0.5"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2] disabled:opacity-75 disabled:cursor-not-allowed"
              :disabled="isExperimentActive"
            />
          </div>
          
          <div>
            <div class="flex justify-between">
              <label for="humidity" class="block text-sm text-[#E2E8F0]">Humidité</label>
              <span class="text-sm text-[#E2E8F0]">{{ humidity }}%</span>
            </div>
            <input 
              type="range" 
              id="humidity" 
              v-model.number="humidity" 
              min="0" 
              max="100" 
              step="1"
              class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2] disabled:opacity-75 disabled:cursor-not-allowed"
              :disabled="isExperimentActive"
            />
          </div>
        </div>
      </div>
      
      <!-- Champ pour la durée de l'expérience -->
      <div>
        <label for="duration" class="block text-sm font-medium text-[#E2E8F0] mb-1">Durée de l'expérience (secondes)</label>
        <input 
          type="number" 
          id="duration" 
          v-model.number="duration" 
          min="1"
          class="w-full px-3 py-2 bg-[#232631] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] text-white disabled:opacity-75 disabled:cursor-not-allowed"
          :disabled="isExperimentActive"
        />
      </div>
      
      <!-- Menu déroulant pour charger des presets -->
      <div>
        <label for="preset" class="block text-sm font-medium text-[#E2E8F0] mb-1">Charger un preset</label>
        <select 
          id="preset" 
          v-model="selectedPreset"
          class="w-full px-3 py-2 bg-[#232631] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] text-white disabled:opacity-75 disabled:cursor-not-allowed"
          @change="loadPreset"
          :disabled="isExperimentActive"
        >
          <option value="">Sélectionner un preset</option>
          <option value="high_success">Preset: Haute Réussite Attendue</option>
          <option value="partial_temp_voltage">Preset: Partielle (Temp/Voltage)</option>
          <option value="crash_voltage">Preset: Crash (Voltage Extrême)</option>
          <option value="partial_frequency">Preset: Partielle (Fréquence Off)</option>
          <option value="edge_low_voltage">Preset: Limite (Voltage Bas)</option>
        </select>
      </div>
      
      <!-- Boutons d'action -->
      <!-- <div class="flex space-x-3 pt-2">
        <button 
          class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          @click="saveConfiguration"
        >
          Sauvegarder Configuration
        </button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Define props
const props = defineProps({
  isExperimentActive: {
    type: Boolean,
    default: false
  }
});

// État des paramètres
const character = ref('A');
let previousValidCharacter = 'A'; // Store last valid character
const voltage = ref(1.7);
const frequency = ref(50);
const temperature = ref(25);
const humidity = ref(50);
const duration = ref(5);
const selectedPreset = ref('');

// Watch for changes in the character input
watch(character, (newValue, oldValue) => {
  const singleLetterRegex = /^[a-zA-Z]$/;
  if (newValue === '' || singleLetterRegex.test(newValue)) {
    // If it's empty or a valid single letter, update previous valid
    previousValidCharacter = newValue || previousValidCharacter; // Keep last valid if empty
  } else {
    // If invalid (e.g., multiple chars, numbers, symbols), revert
    console.warn('Invalid character entered. Only single letters allowed.');
    character.value = previousValidCharacter;
    // TODO: Optionally add user feedback like a temporary error message or border color
  }
  // Limit length just in case regex fails or pasting occurs (redundant but safe)
  if (newValue && newValue.length > 1) {
      character.value = newValue.charAt(0);
      if (!singleLetterRegex.test(character.value)) { // Check again after slicing
          character.value = previousValidCharacter;
      }
  }
});

// Charger un preset
const loadPreset = () => {
  character.value = 'P'; // Change character for presets to see different input
  switch (selectedPreset.value) {
    case 'high_success': // Aim for success_rate >= 0.9
      voltage.value = 2.5;    // Good voltage (1.5-3.5 optimal base)
      frequency.value = 32;   // OPF = 2.5 * 32 = 80 (optimal)
      temperature.value = 25; // Optimal temp
      humidity.value = 50;    // Optimal humidity
      duration.value = 20; 
      break;
    case 'partial_temp_voltage': // Aim for 0.1 <= success_rate < 0.9
      voltage.value = 1.2;    // Low-ish voltage (base score 0.5)
      frequency.value = 50;   // OPF = 1.2 * 50 = 60 (off from 80)
      temperature.value = 32; // Temp a bit high (moderate penalty)
      humidity.value = 60;    // Optimal humidity
      duration.value = 25;
      break;
    case 'crash_voltage': // Aim for success_rate < 0.1
      voltage.value = 0.3;    // Extreme low voltage (should force crash)
      frequency.value = 40;   // Freq doesn't matter much if voltage crashes
      temperature.value = 25; // Optimal temp
      humidity.value = 50;    // Optimal humidity
      duration.value = 10;
      break;
    case 'partial_frequency': // Aim for 0.1 <= success_rate < 0.9
      voltage.value = 2.0;    // Good voltage
      frequency.value = 15;   // Low frequency (OPF = 30, off from 80; also freq near boundary)
      temperature.value = 26; // Slightly off optimal temp
      humidity.value = 75;    // Slightly off optimal humidity
      duration.value = 30;
      break;
    case 'edge_low_voltage': // Aim for a score that is low but not necessarily a crash, to see corruption
      voltage.value = 0.8;    // Low voltage (base score 0.5)
      frequency.value = 60;   // OPF = 0.8 * 60 = 48 (off from 80)
      temperature.value = 28; // Temp a bit high
      humidity.value = 40;    // Optimal humidity
      duration.value = 15;
      break;
    default:
      // Optionally reset to some default if no preset or unknown preset is chosen
      voltage.value = 1.7;
      frequency.value = 50;
      temperature.value = 25;
      humidity.value = 50;
      duration.value = 30;
      character.value = 'A';
      break;
  }
};

// Sauvegarder la configuration
const saveConfiguration = () => {
  // console.log('Configuration sauvegardée', {
  //   character: character.value,
  //   voltage: voltage.value,
  //   frequency: frequency.value,
  //   temperature: temperature.value,
  //   humidity: humidity.value,
  //   duration: duration.value
  // });
};

// Exposer les méthodes et propriétés pour le composant parent
defineExpose({
  character, // Expose character ref directly
  getConfigurationData: () => ({
    // input_txt: character.value, // Removed - parent accesses character ref
    voltage_tension: parseFloat(voltage.value),
    frequency: parseFloat(frequency.value),
    temperature: parseFloat(temperature.value),
    humidity: parseFloat(humidity.value),
    duration_sec: parseInt(duration.value)
  }),
  saveConfiguration
});
</script> 