import { defineStore } from 'pinia';

export interface IsTypingItem {
  text: string;
  nick: string;
}

export const useIstypingStore = defineStore('istyping', {
  state: () => ({
    isTypingItem: { text: '', nick: '' } as IsTypingItem
  }),
  actions: {
    setIsTypingText( nick: string, text: string ) {
      this.isTypingItem = { text, nick };
    }
  },
  getters: {
    getIsTypingText: (state) => state.isTypingItem
  }
});
