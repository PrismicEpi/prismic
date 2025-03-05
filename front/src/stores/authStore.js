import { defineStore } from 'pinia';
import router from '@/router';
import { authenticateUser } from '@/apis/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },

    setUser(user) {
      this.user = user;
    },

    // TODO : Gérer les erreurs
    async login(token) {
      console.log('login', token);
      const response = await authenticateUser(token);
      console.log('response', response);
      if (response.status === 'ok') {
        this.setToken(token);
        router.push('/dashboard');
      } else {
        console.log('error', response);
      }
    },

    async logout() {
      this.setToken(null);
      this.setUser(null);
      router.push('/login');
    },

    checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.setToken(token);
        return true;
      }
      return false;
    }
  },

  persist: {
    storage: localStorage,
    paths: ['token'],
  },
});