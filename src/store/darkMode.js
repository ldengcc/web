import { defineStore } from 'pinia';
import { ref, watchEffect } from 'vue';

export const useDarkModeStore = defineStore('darkMode', () => {
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('darkMode', isDarkMode.value);
  };

  watchEffect(() => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  return { isDarkMode, toggleDarkMode };
});
