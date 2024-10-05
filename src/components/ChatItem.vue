<template>
  <q-item class="chat-item" @mouseover="hover" @mouseleave="unhover">
    <q-item-section avatar>
      <i class="fas fa-circle-user"></i>
    </q-item-section>
    <q-item-section>
      <div class="chat-item-content">
        <q-item-label class="chat-name">Chat name</q-item-label>
        <q-item-label class="chat-message">Last message</q-item-label>
      </div>
    </q-item-section>
    <transition name="fade" appear>
      <div v-show="show" class="hover-icon">
        <i class="fas fa-ellipsis"></i>
      </div>
    </transition>
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
const hovering = ref(false);


const hover = () => {
  hovering.value = true;
  setTimeout(() => {
    show.value = hovering.value;
  }, 200);
};

const unhover = () => {
  hovering.value = false;
  show.value = false;
};
</script>
