import { defineStore } from 'pinia';

export const useModeStore = defineStore('mode', {
  state: () => ({
    mode: 'sp' as 'on' | 'off' | 'sp',
    status: 'on' as 'on' | 'off' | 'dnd',
  }),
  actions: {
    setMode(newMode: 'on' | 'off' | 'sp') {
      this.mode = newMode;
    },
    setStatus(newStatus: 'on' | 'off' | 'dnd') {
      this.status = newStatus;
    },
  },
});
