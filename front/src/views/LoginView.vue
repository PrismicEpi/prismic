<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LoaderCircle } from 'lucide-vue-next'

const token = ref('')
const loading = ref(false)
const router = useRouter()
const isMessageError = ref(false)
const messageError = ref('')

const login = async () => {
    if (!token.value) {
        messageError.value = 'The token field is required'
        isMessageError.value = true
        return
    } else {
        isMessageError.value = false
    }

    loading.value = true

    try {
        // TODO : Gérer les erreurs
    } catch (error) {
        console.error('Network error:', error)
        messageError.value = 'Network error occurred'
        isMessageError.value = true
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex justify-center items-center h-screen bg-background text-white">
        <div class="w-full max-w-md">
            <form @submit.prevent="login" class="bg-foreground shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                    <label class="block text-gray-400 font-bold mb-2" for="token">
                        Token
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-[--secondary] focus:ring-[--secondary]"
                        id="token" type="text" placeholder="Enter the Token" v-model="token" />
                    <p v-if="isMessageError" class="text-red-500 text-sm mt-2">{{ messageError }}</p>
                </div>
                <div class="flex items-center justify-between">
                    <!-- TODO : Gérer pour que le loader soit bien centré sans mettre une width définie -->
                    <button
                        class="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        <p v-if="!loading">Authenticate</p>
                        <LoaderCircle v-else class="animate-spin text-white m-auto" />
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
