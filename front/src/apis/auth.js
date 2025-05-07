const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function authenticateUser(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { ...data, status: 'ok' };
    } else {
      return { status: 'false' };
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    throw error;
  }
}