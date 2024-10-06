<template>
  <q-page id="list">
    <div class="chat-list-title">
        <q-item-label class="chat-panel-text">Archive</q-item-label>
    </div>
    <q-input rounded standout bottom-slots v-model="search" label="Search" dense>
      <template v-slot:append>
        <q-icon name="search" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>


    <ChatListItem />
    <ChatListItem />
    <ChatListItem />
    <ChatListItem />
    <ChatListItem />

  </q-page>
</template>

<script setup scoped lang="ts">
import { ref } from 'vue';
import ChatListItem from './ChatListItem.vue';
  const search = ref<string>('')
</script>
