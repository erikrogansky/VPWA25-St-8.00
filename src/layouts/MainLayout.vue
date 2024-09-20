<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      :mini="!expanded"
      :mini-width="56"
      :width="200"
      show-if-above
      side="left"
      class="bg-grey-8"
    >
      <div class="drawer-content">
        <q-list class="drawer-list">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-comment left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label>Chats</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-users left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label>Channels</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-comment-dots left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label>Requests</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <i class="fas fa-archive left-panel-icon"></i>
            </q-item-section>
            <q-item-section v-if="expanded">
              <q-item-label>Archive</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-space />
        <q-item clickable v-ripple @click="toggleExpand" class="q-pa-md">
          <q-item-section avatar>
            <i class="fas fa-table-columns left-panel-icon"></i>
          </q-item-section>
          <q-item-section v-if="expanded">
            <q-item-label>Collapse</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  name: 'MainLayout',
});

const leftDrawerOpen = ref(false);
const expanded = ref(false);

function toggleExpand() {
  expanded.value = !expanded.value;
}
</script>

<style lang="scss" scoped>
.q-drawer {
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-list {
  flex-grow: 1;
}

.left-panel-icon {
  font-size: 24px;
  color: $font;
}
</style>
