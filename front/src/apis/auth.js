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
      let errorMessage = 'Authentication failed. Please check your token or try again.';
      try {
        const errorData = await response.json();
        if (errorData.error && errorData.error.detail) {
          errorMessage = errorData.error.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (response.statusText && response.status !== 500) {
          errorMessage = response.statusText;
        }
      } catch (e) {
        if (response.statusText && response.status !== 500) {
          errorMessage = response.statusText;
        }
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    // Re-throw the error to be caught by the caller (authStore.login)
    // If it's a network error or error from the 'throw new Error(errorMessage)' above.
    throw error;
  }
}