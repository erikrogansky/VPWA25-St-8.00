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


    <q-item class="chat-item">
      <q-item-section avatar>
        <i class="fas fa-circle-user"></i>
      </q-item-section>
      <q-item-section>
        <div>
          <q-item-label class="chat-name">Chat name</q-item-label>
        </div>
        <div>
          <q-item-label class="chat-message">Last message</q-item-label>
        </div>
      </q-item-section>
      <div class="hover-icon">
        <i class="fas fa-ellipsis"></i>
      </div>
    </q-item>

    <q-item class="chat-item">
      <q-item-section avatar>
        <i class="fas fa-circle-user"></i>
      </q-item-section>
      <q-item-section>
        <div>
          <q-item-label class="chat-name">Chat name</q-item-label>
        </div>
        <div>
          <q-item-label class="chat-message">Last message</q-item-label>
        </div>
      </q-item-section>
      <div class="hover-icon">
        <i class="fas fa-ellipsis"></i>
      </div>
    </q-item>

    <q-item class="chat-item">
      <q-item-section avatar>
        <i class="fas fa-circle-user"></i>
      </q-item-section>
      <q-item-section>
        <div>
          <q-item-label class="chat-name">Chat name</q-item-label>
        </div>
        <div>
          <q-item-label class="chat-message">Last message</q-item-label>
        </div>
      </q-item-section>
      <div class="hover-icon">
        <i class="fas fa-ellipsis"></i>
      </div>
    </q-item>

    <q-item class="chat-item">
      <q-item-section avatar>
        <i class="fas fa-circle-user"></i>
      </q-item-section>
      <q-item-section>
        <div>
          <q-item-label class="chat-name">Chat name</q-item-label>
        </div>
        <div>
          <q-item-label class="chat-message">Last message</q-item-label>
        </div>
      </q-item-section>
      <div class="hover-icon">
        <i class="fas fa-ellipsis"></i>
      </div>
    </q-item>
  </q-page>
</template>

<script setup scoped lang="ts">
import { ref } from 'vue';
  const search = ref<string>('')
</script>
