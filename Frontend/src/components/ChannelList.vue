<template>
  <q-page id="list">
    <div class="chat-list-title">
      <q-item-label class="chat-panel-text">Channels</q-item-label>
      <q-item clickable v-ripple @click="showCreateChannel = true">
        <i class="fas fa-edit chat-panel-icon edit"></i>
      </q-item>
    </div>
    <q-input
      rounded
      standout
      bottom-slots
      v-model="search"
      label="Search"
      dense
      @input="updateSearch"
    >
      <template v-slot:append>
        <q-icon name="search" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>

    <div v-if="showCreateChannel" class="create-channel-form">
      <div v-if="showTitleInput">
        <q-input standout v-model="newChannelTitle" label="Title" />
      </div>
      <q-input standout v-model="newChannelUser" label="User(s)" @keyup.enter="addUser" />
      <div class="tags">
        <q-chip
          v-for="(user, index) in newChannelUsers"
          :key="index"
          removable
          @remove="removeUser(index)"
        >
          {{ user }}
        </q-chip>
      </div>
      <q-checkbox v-model="isPublic" label="Public Channel" />
      <div class="form-actions">
        <q-btn flat label="Cancel" @click="showCreateChannel = false" />
        <q-btn flat label="Create" @click="createChannel" />
      </div>
      <q-separator />
    </div>

    <ChatListItem
      v-for="(channel, index) in filteredChannelItems"
      :key="index"
      :title="channel.title"
      :lastMessage="channel.lastMessage"
      :unread="channel.unread"
      channel
      :isPublic="channel.isPublic"
      @click="handleChatItemClick(channel.title)"
      clickable
      :isOwner="channel.isOwner"
    />

    <template v-if="filteredChannelItemsFromDB.length !== 0">
      <q-separator />
      <ChatListItem
        v-for="(channel, index) in filteredChannelItemsFromDB"
        :key="index"
        :title="channel.title"
        :lastMessage="channel.lastMessage"
        :unread="channel.unread"
        channel
        :isPublic="channel.isPublic"
        @click="handleChatItemClick(channel.title)"
        clickable
        :isOwner="channel.isOwner"
      />
    </template>
  </q-page>
</template>

<script setup scoped lang="ts">
import { computed, ref, onMounted, toRaw, watchEffect } from 'vue';
import ChatListItem from './ChatListItem.vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const search = ref<string>('');
const showCreateChannel = ref<boolean>(false);
const newChannelUser = ref<string>('');
const newChannelUsers = ref<string[]>([]);
const isPublic = ref<boolean>(false);
const newChannelTitle = ref<string>('');

import { useChannelStore } from 'src/stores/channel_store';
const channelStore = useChannelStore();

const filteredChannelItems = computed(() => {
  return channelStore.filteredChannelItems(search.value);
});

interface Channel {
  title: string;
  lastMessage: string;
  unread: boolean;
  isPublic: boolean;
  isOwner: boolean;
}

const filteredChannelItemsFromDB = ref<Channel[]>([]);

const fetchFilteredChannelItems = async () => {
  try {
    if (!search.value) {
      filteredChannelItemsFromDB.value = [];
      return;
    }
    const response = await api.get('/get-public-channels', {
      params: {
        search: search.value,
      },
    });

    if (response.data.success && Array.isArray(response.data.channels)) {
      filteredChannelItemsFromDB.value = response.data.channels.map((channel: { name: string; lastMessage: string; isOwner: boolean; }) => ({
        title: channel.name,
        lastMessage: channel.lastMessage || 'No messages yet',
        unread: false,
        isPublic: true,
        isOwner: channel.isOwner,
      }));
    } else {
      console.error('Unexpected response format:', response.data);
      filteredChannelItemsFromDB.value = [];
    }
  } catch (error) {
    console.error('Error fetching channels:', error);
  }
};

// Watch for changes in dependencies and fetch data
watchEffect(() => {
  fetchFilteredChannelItems();
});

const updateSearch = (value: string) => {
  search.value = value;
};

const addUser = () => {
  if (newChannelUser.value.trim() !== '') {
    newChannelUsers.value.push(newChannelUser.value.trim());
    newChannelUser.value = '';
  }
};

const removeUser = (index: number) => {
  newChannelUsers.value.splice(index, 1);
};

const createChannel = async () => {
  if (!newChannelTitle.value && newChannelUsers.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Please provide a nickname or select users.',
    });
    return;
  }

  try {
    const response = await api.post('/add-channel', {
      users: toRaw(newChannelUsers.value),
      isPublic: isPublic.value,
      title: newChannelTitle.value ? newChannelTitle.value : newChannelUsers.value[0],
    });
    console.log('Channel created:', response.data);
    $q.notify({
      type: 'positive',
      message: 'Channel created successfully!',
    });
    showCreateChannel.value = false;
    newChannelUsers.value = [];
    isPublic.value = false;
    newChannelTitle.value = '';
    channelStore.fetchChannels();
  } catch (error) {
    console.error('Error creating channel:', error);
    $q.notify({
      type: 'negative',
      message: 'Error creating channel: ' + ((error as unknown as { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message),
    });
  }
};

const showTitleInput = computed(() => {
  return isPublic.value || newChannelUsers.value.length > 1;
});

onMounted(() => {
  channelStore.fetchChannels();
});

const emit = defineEmits(['chat-item-click']);

const handleChatItemClick = (title: string) => {
  emit('chat-item-click', title);
};
</script>

<style scoped>
.create-channel-form {
  max-width: 100%;
  margin-bottom: 20px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-width: 100%;
}

.tags .q-chip {
  background-color: var(--font);
  color: var(--font-reverse);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
