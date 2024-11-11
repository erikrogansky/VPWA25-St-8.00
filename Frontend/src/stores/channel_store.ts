import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import axios from 'axios';

export interface ChannelItem {
  title: string;
  lastMessage: string;
  unread: boolean;
  isPublic: boolean;
  isOwner: boolean;
}

export const useChannelStore = defineStore('channel', {
  state: () => ({
    channelItems: [] as ChannelItem[],
  }),
  actions: {
    async fetchChannels() {
      if (this.channelItems.length !== 0) {
        this.channelItems = [];
      }
      try {
        const response = await api.get('/get-channels', {
          params: {
            type: 'channel'
          }
        });
        if (Array.isArray(response.data.chats)) {
          this.channelItems = response.data.chats.map((channel: { channel: { name: string, isPublic: boolean }; unreadMessages: number, channelOwner: boolean }) => ({
            title: channel.channel.name,
            lastMessage: 'Last message.',
            unread: channel.unreadMessages > 0,
            isPublic: channel.channel.isPublic,
            isOwner: channel.channelOwner,
          }));
        } else {
          this.channelItems = [];
        }
      } catch (error: unknown) {
        this.channelItems = [];
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
    filteredChannelItems: (state) => (search: string) => {
      return state.channelItems.filter((channel) =>
        channel.title.toLowerCase().includes(search.toLowerCase())
      );
    },

    channelItemsForSearch: (state) => state.channelItems,
  },
});
