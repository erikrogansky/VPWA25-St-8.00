import { defineStore } from 'pinia';

export const useModeStore = defineStore('mode', {
  state: () => ({
    mode: 'sp' as 'on' | 'off' | 'sp',
  }),
  actions: {
    setMode(newMode: 'on' | 'off' | 'sp') {
      this.mode = newMode;
    },
  },
});
