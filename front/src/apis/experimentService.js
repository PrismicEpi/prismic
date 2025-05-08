const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuthStore } from '@/stores/authStore';

export async function createExperimentApi(experimentData) {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (!token) {
    throw new Error('Authentication token not found.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/experiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(experimentData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`API Error: ${response.status} ${errorData.message || ''}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error;
  }
} 