<template>
  <q-item class="chat-item" @mouseover="hover" @mouseleave="unhover">
    <q-item-section avatar>
      <i class="fas fa-circle-user"></i>
      <i class="fas fa-circle" style="position: absolute; font-size: 12px; bottom: 14px; left: 34px; color: lime;" />
    </q-item-section>
    <q-item-section>
      <div class="chat-item-content">
        <q-item-label class="chat-name">Chat name</q-item-label>
        <q-item-label class="chat-message">Last message</q-item-label>
      </div>
    </q-item-section>
    <transition name="fade" appear>
      <div v-show="show" class="hover-icon" style="cursor: pointer;">
        <i class="fas fa-ellipsis"></i>
        <q-menu anchor="bottom left" self="top left" @show="onMenuShow" @hide="onMenuHide" class="user-popup">
          <q-list style="min-width: 200px; height: auto;">
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-envelope"></i></q-item-section>
              <q-item-section>Mark as read</q-item-section>
            </q-item>
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-user"></i></q-item-section>
              <q-item-section>View profile</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-box-archive"></i></q-item-section>
              <q-item-section>Archive chat</q-item-section>
            </q-item>
            <q-item clickable @click="onMenuItemClick" v-close-popup>
              <q-item-section avatar><i class="fas fa-trash"></i></q-item-section>
              <q-item-section>Delete chat</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </transition>
  </q-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
const hovering = ref(false);
const menuOpen = ref(false);

const hover = () => {
  hovering.value = true;
  setTimeout(() => {
    show.value = hovering.value || menuOpen.value;
  }, 200);
};

const unhover = () => {
  hovering.value = false;
  setTimeout(() => {
    if (!menuOpen.value) {
      show.value = false;
    }
  }, 200);
};

const onMenuShow = () => {
  menuOpen.value = true;
  show.value = true;
};

const onMenuHide = () => {
  menuOpen.value = false;
  if (!hovering.value) {
    show.value = false;
  }
};

const onMenuItemClick = () => {
  menuOpen.value = false;
  show.value = false;
};

</script>
