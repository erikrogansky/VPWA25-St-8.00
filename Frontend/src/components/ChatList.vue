<template>
  <q-page id="list">
    <div class="chat-list-title">
        <q-item-label class="chat-panel-text">Chats</q-item-label>
        <q-item clickable v-ripple>
          <i class="fas fa-edit chat-panel-icon edit"></i>
        </q-item>
    </div>
    <q-input rounded standout bottom-slots v-model="search" label="Search" dense>
      <template v-slot:append>
        <q-icon name="search" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>

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
import { computed, ref, onMounted } from 'vue';
import ChatListItem from './ChatListItem.vue';
const search = ref<string>('')

import { useChatStore } from 'src/stores/chat_store';
const chatStore = useChatStore();

const filteredChatItems = computed(() => {
  return chatStore.filteredChatItems(search.value);
});

onMounted(() => {
  chatStore.fetchChatItems();
});
</script>
