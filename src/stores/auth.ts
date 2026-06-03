import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthStorageService } from '../services/AuthStorageService';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(AuthStorageService.getToken());
  const isLoggedIn = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    AuthStorageService.setToken(newToken);
  }

  function clearToken() {
    token.value = null;
    AuthStorageService.removeToken();
  }

  function checkAuth(): boolean {
    const storedToken = AuthStorageService.getToken();
    if (storedToken) {
      token.value = storedToken;
      return true;
    }
    return false;
  }

  return {
    token,
    isLoggedIn,
    setToken,
    clearToken,
    checkAuth,
  };
});
