import { defineStore } from 'pinia';
import axios from 'axios';

export interface ChatItem {
  title: string;
  lastMessage: string;
  unread: boolean;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatItems: [] as ChatItem[],
  }),
  actions: {
    async fetchChats() {
      try {
        const response = await axios.get('/api/channels/chats');
        this.chatItems = response.data;
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    },
  },
  getters: {
    filteredChatItems: (state) => (search: string) => {
      return state.chatItems.filter((chat) =>
        chat.title.toLowerCase().includes(search.toLowerCase())
      );
    },
  },
});
