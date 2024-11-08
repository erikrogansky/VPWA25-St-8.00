import { reactive } from 'vue';
import { io } from 'socket.io-client';

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
});

const URL = process.env.VUE_APP_SOCKET_URL || 'http://localhost:3333';

export const socket = io(URL);

socket.on('connect_error', (error) => {
  console.error('Connection Error:', error);
});

socket.on('connect', () => {
  state.connected = true;
});

socket.on('disconnect', () => {
  state.connected = false;
});

export default { state, socket };