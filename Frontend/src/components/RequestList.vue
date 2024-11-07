<template>
  <q-page id="list">
    <div class="chat-list-title">
        <q-item-label class="chat-panel-text">Requests</q-item-label>
    </div>
    <q-input rounded standout bottom-slots v-model="search" label="Search" dense>
      <template v-slot:append>
        <q-icon name="search" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>


    <ChatListItem
      v-for="(request, index) in filteredRequestItems"
      :key="index"
      :title="request.title"
      :lastMessage="request.lastMessage"
      :unread="request.unread"
    />
  </q-page>
</template>

<script setup scoped lang="ts">
import { computed, ref, onMounted } from 'vue';
import ChatListItem from './ChatListItem.vue';
import { useRequestStore } from 'src/stores/request-store';

const search = ref<string>('');
const requestStore = useRequestStore();

const filteredRequestItems = computed(() => {
  return requestStore.filteredChatItems(search.value);
});

onMounted(() => {
  requestStore.fetchChats();
});
</script>
