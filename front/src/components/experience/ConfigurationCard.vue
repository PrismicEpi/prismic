<template>
    <div class="bg-[#1A1C23] rounded-lg p-6 shadow-lg">
        <h3 class="text-xl font-semibold mb-4 text-white">Configuration</h3>

        <div class="space-y-4">
            <!-- Champ pour le caractère à stocker -->
            <div>
                <label for="character" class="block text-sm font-medium text-[#E2E8F0] mb-1">Caractère à stocker</label>
                <input type="text" id="character" v-model="character" maxlength="1"
                    class="w-full px-3 py-2 bg-[#232631] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] text-white" />
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
                        <input type="range" id="voltage" v-model="voltage" min="0" max="5" step="0.1"
                            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2]" />
                    </div>

                    <div>
                        <div class="flex justify-between">
                            <label for="frequency" class="block text-sm text-[#E2E8F0]">Fréquence</label>
                            <span class="text-sm text-[#E2E8F0]">{{ frequency }} Hz</span>
                        </div>
                        <input type="range" id="frequency" v-model="frequency" min="1" max="100" step="1"
                            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2]" />
                    </div>
                </div>
            </div>

            <!-- Paramètres de la cavité optique -->
            <div>
                <h4 class="text-md font-medium text-[#E2E8F0] mb-2">Paramètres de la cavité optique</h4>

                <div class="space-y-3">
                    <div>
                        <div class="flex justify-between">
                            <label for="temperature" class="block text-sm text-[#E2E8F0]">Température</label>
                            <span class="text-sm text-[#E2E8F0]">{{ temperature }}°C</span>
                        </div>
                        <input type="range" id="temperature" v-model="temperature" min="20" max="40" step="0.5"
                            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2]" />
                    </div>

                    <div>
                        <div class="flex justify-between">
                            <label for="pressure" class="block text-sm text-[#E2E8F0]">Pression</label>
                            <span class="text-sm text-[#E2E8F0]">{{ pressure }} Pa</span>
                        </div>
                        <input type="range" id="pressure" v-model="pressure" min="100" max="1000" step="10"
                            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#7E3AF2]" />
                    </div>
                </div>
            </div>

            <!-- Menu déroulant pour charger des presets -->
            <div>
                <label for="preset" class="block text-sm font-medium text-[#E2E8F0] mb-1">Charger un preset</label>
                <select id="preset" v-model="selectedPreset"
                    class="w-full px-3 py-2 bg-[#232631] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7E3AF2] text-white"
                    @change="loadPreset">
                    <option value="">Sélectionner un preset</option>
                    <option value="preset1">Preset 1 - Haute précision</option>
                    <option value="preset2">Preset 2 - Basse consommation</option>
                    <option value="preset3">Preset 3 - Longue durée</option>
                </select>
            </div>

            <!-- Boutons d'action -->
            <div class="flex space-x-3 pt-2">
                <button
                    class="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    @click="saveConfiguration">
                    Sauvegarder
                </button>
                <button
                    class="flex-1 px-4 py-2 bg-[#7E3AF2] text-white rounded-md hover:bg-[#6C2BD9] focus:outline-none focus:ring-2 focus:ring-[#7E3AF2]"
                    @click="startExperiment">
                    {{ isRunning ? 'Arrêter' : 'Lancer' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Définir les émetteurs d'événements
const emit = defineEmits(['start-experiment']);

// État des paramètres
const character = ref('A');
const voltage = ref(1.7);
const frequency = ref(50);
const temperature = ref(25);
const pressure = ref(500);
const selectedPreset = ref('');
const isRunning = ref(false);

// Charger un preset
const loadPreset = () => {
    if (selectedPreset.value === 'preset1') {
        voltage.value = 1.7;
        frequency.value = 60;
        temperature.value = 24;
        pressure.value = 450;
    } else if (selectedPreset.value === 'preset2') {
        voltage.value = 1.2;
        frequency.value = 40;
        temperature.value = 22;
        pressure.value = 400;
    } else if (selectedPreset.value === 'preset3') {
        voltage.value = 1.5;
        frequency.value = 30;
        temperature.value = 26;
        pressure.value = 550;
    }
};

// Sauvegarder la configuration
const saveConfiguration = () => {
    // Logique pour sauvegarder la configuration
    console.log('Configuration sauvegardée', {
        character: character.value,
        voltage: voltage.value,
        frequency: frequency.value,
        temperature: temperature.value,
        pressure: pressure.value
    });
};

// Démarrer l'expérience
const startExperiment = () => {
    isRunning.value = !isRunning.value;

    // Émettre l'événement pour informer le parent
    emit('start-experiment', isRunning.value);

    if (isRunning.value) {
        console.log('Expérience démarrée avec les paramètres:', {
            character: character.value,
            voltage: voltage.value,
            frequency: frequency.value,
            temperature: temperature.value,
            pressure: pressure.value
        });
    } else {
        console.log('Expérience arrêtée');
    }
};

// Exposer les méthodes et propriétés pour le composant parent
defineExpose({
    character,
    voltage,
    frequency,
    temperature,
    pressure,
    isRunning,
    startExperiment,
    saveConfiguration
});
</script>