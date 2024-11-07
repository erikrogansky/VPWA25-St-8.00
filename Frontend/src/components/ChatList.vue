<template>
  <q-page id="list">
    <div class="chat-list-title">
      <q-item-label class="chat-panel-text">Chats</q-item-label>
      <q-item clickable v-ripple @click="showCreateChat = true">
        <i class="fas fa-edit chat-panel-icon edit"></i>
      </q-item>
    </div>
    <q-input rounded standout bottom-slots v-model="search" label="Search" dense>
      <template v-slot:append>
        <q-icon name="search" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>

    <div v-if="showCreateChat" class="create-chat-form">
      <div v-if="showTitleInput">
        <q-input standout v-model="newChatTitle" label="Title" />
      </div>
      <q-input standout v-model="newChatUser" label="User(s)" @keyup.enter="addUser" />
      <div class="tags">
        <q-chip
          v-for="(user, index) in newChatUsers"
          :key="index"
          removable
          @remove="removeUser(index)"
        >
          {{ user }}
        </q-chip>
      </div>
      <q-checkbox v-model="isPublic" label="Public Chat" />
      <div class="form-actions">
        <q-btn flat label="Cancel" @click="showCreateChat = false" />
        <q-btn flat label="Create" @click="createChat" />
      </div>
      <q-separator />
    </div>

    <ChatListItem
      v-for="(chat, index) in filteredChatItems"
      :key="index"
      :title="chat.title"
      :lastMessage="chat.lastMessage"
      :unread="chat.unread"
    />
  </q-page>
</template>

<script setup scoped lang="ts">
import { computed, ref, onMounted, toRaw } from 'vue';
import ChatListItem from './ChatListItem.vue';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const search = ref<string>('');
const showCreateChat = ref<boolean>(false);
const newChatUser = ref<string>('');
const newChatUsers = ref<string[]>([]);
const isPublic = ref<boolean>(false);
const newChatTitle = ref<string>('');

import { useChatStore } from 'src/stores/chat_store';
const chatStore = useChatStore();

const filteredChatItems = computed(() => {
  return chatStore.filteredChatItems(search.value);
});

const addUser = () => {
  if (newChatUser.value.trim() !== '') {
    newChatUsers.value.push(newChatUser.value.trim());
    newChatUser.value = '';
  }
};

const removeUser = (index: number) => {
  newChatUsers.value.splice(index, 1);
};

const createChat = async () => {
  if (!newChatTitle.value && newChatUsers.value.length === 0) {
    $q.notify({
      type: 'negative',
      message: 'Please provide a nickname or select users.',
    });
    return;
  }

  try {
    const response = await api.post('/add-channel', {
      users: toRaw(newChatUsers.value),
      isPublic: isPublic.value,
      title: newChatTitle.value ? newChatTitle.value : newChatUsers.value[0],
    });
    console.log('Chat created:', response.data);
    $q.notify({
      type: 'positive',
      message: 'Chat created successfully!',
    });
    showCreateChat.value = false;
    newChatUsers.value = [];
    isPublic.value = false;
    newChatTitle.value = '';
    chatStore.fetchChats();
  } catch (error) {
    console.error('Error creating chat:', error);
    $q.notify({
      type: 'negative',
      message: 'Error creating chat: ' + ((error as unknown as { response?: { data?: { message?: string } } }).response?.data?.message || (error as Error).message),
    });
  }
};

const showTitleInput = computed(() => {
  return isPublic.value || newChatUsers.value.length > 1;
});

onMounted(() => {
  chatStore.fetchChats();
});
</script>

<style scoped>
.create-chat-form {
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
