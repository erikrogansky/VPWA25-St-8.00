import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
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
      if (this.chatItems.length !== 0) {
        this.chatItems = [];
      }
      try {
        const response = await api.get('/get-channels', {
          params: {
            type: 'chat'
          }
        });
        if (Array.isArray(response.data.chats)) {
          this.chatItems = response.data.chats.map((chat: { channel: { name: string }; unreadMessages: number }) => ({
            title: chat.channel.name,
            lastMessage: 'Last message.',
            unread: chat.unreadMessages > 0,
          }));
        } else {
          this.chatItems = [];
        }
      } catch (error: unknown) {
        this.chatItems = [];
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.data.message !== 'No chats found') {
            console.error('Error fetching chats:', error);
            console.error('Error response data:', error.response.data);
          }
        } else {
          console.error('Error fetching chats:', error);
        }
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
