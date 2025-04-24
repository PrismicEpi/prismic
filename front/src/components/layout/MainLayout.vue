<template>
  <div class="flex h-screen bg-[#121317] text-white">
    <!-- Navbar verticale -->
    <aside class="w-64 h-full bg-[#1A1C23] flex flex-col">
      <!-- Logo en haut -->
      <div class="p-4 flex justify-center">
        <img src="@/assets/logo.svg" alt="PRISMIC Logo" class="h-10" />
      </div>
      
      <!-- Menu principal -->
      <nav class="flex-1 px-2 py-4">
        <ul class="space-y-2">
          <li>
            <router-link 
              to="/" 
              class="flex items-center px-4 py-2 rounded-md group"
              :class="{ 'bg-[#232631] border-l-4 border-[#7E3AF2]': $route.path === '/' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Expérience
            </router-link>
          </li>
          <li>
            <router-link 
              to="/historique" 
              class="flex items-center px-4 py-2 rounded-md group"
              :class="{ 'bg-[#232631] border-l-4 border-[#7E3AF2]': $route.path === '/historique' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Historique
            </router-link>
          </li>
        </ul>
      </nav>
      
      <!-- Menu Settings en bas -->
      <div class="p-4 border-t border-gray-700">
        <button class="flex items-center px-4 py-2 w-full rounded-md hover:bg-[#232631]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Paramètres
        </button>
      </div>
    </aside>
    
    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-[#1A1C23] p-4 flex justify-between items-center">
        <div class="flex items-center">
          <div class="relative">
            <button class="flex items-center space-x-2 focus:outline-none" @click="toggleUserMenu">
              <img src="@/assets/avatar.png" alt="Avatar" class="h-8 w-8 rounded-full" />
              <span>Utilisateur</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="userMenuOpen" class="absolute mt-2 w-48 bg-[#1A1C23] rounded-md shadow-lg py-1 z-10">
              <a href="#" class="block px-4 py-2 hover:bg-[#232631]">Profil</a>
              <a href="#" class="block px-4 py-2 hover:bg-[#232631]">Déconnexion</a>
            </div>
          </div>
        </div>
        <div>
          <router-link to="/">
            <img src="@/assets/logo.svg" alt="PRISMIC Logo" class="h-8" />
          </router-link>
        </div>
      </header>
      
      <!-- Contenu de la page -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userMenuOpen = ref(false);

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};
</script> 