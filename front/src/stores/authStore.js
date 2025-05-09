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
      try {
        console.log('login action with token:', token);
        const responseData = await authenticateUser(token); // Expected to throw on failure
        
        // If authenticateUser resolves without error, it means responseData.status is 'ok'
        // and responseData contains user details.
        console.log('Authentication successful, response data:', responseData);
        
        this.setToken(token); // The original Firebase token
        const { userName, email, avatar } = responseData;
        this.setUser({ userName, email, avatar });
        router.push('/');
        
      } catch (error) {
        console.error('Login action failed in authStore:', error.message);
        // Re-throw the error so the component can catch it and display it
        throw error; 
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