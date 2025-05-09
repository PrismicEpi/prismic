<template>
  <div id="app">
    <MainLayout v-if="!isLoginPage">
      <router-view />
    </MainLayout>
    <router-view v-else />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
</script>