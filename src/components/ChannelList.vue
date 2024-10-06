<template>
  <q-page id="list">
    <div class="chat-list-title">
        <q-item-label class="chat-panel-text">Channels</q-item-label>
        <q-item clickable v-ripple>
          <i class="fas fa-edit chat-panel-icon edit"></i>
        </q-item>
    </div>
    <q-input rounded standout bottom-slots v-model="search" label="Search" dense>
      <template v-slot:append>
        <q-icon name="search" @click="search = ''" class="cursor-pointer" />
      </template>
    </q-input>



    <ChannelListItem />
    <ChannelListItem />
    <ChannelListItem />
    <ChannelListItem />
    <ChannelListItem />

  </q-page>
</template>

<script setup scoped lang="ts">
import { ref } from 'vue';
import ChannelListItem from './ChannelListItem.vue';
  const search = ref<string>('')
</script>
