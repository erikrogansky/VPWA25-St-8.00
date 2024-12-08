import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export interface User {
  id: number;
  nick: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  mode: string;
  notifications: string;
  activeStatus: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async fetchUser() {
      try {
        const response = await api.get('/get-user');
        this.user = response.data;
        console.log('User information:', this.user);
      } catch (error) {;
        console.error('Error fetching user information:', error);
      }
    },
  },
  getters: {
    userName: (state) => state.user?.nick || '',
    userActiveStatus: (state) => state.user?.activeStatus || '',
  },
});
