<template>
  <q-page id="chat-page">
        <div class="chat-container">
          <div class="chat-header">
            <q-item class="chat-header-info">
              <q-item-section avatar>
                <i class="fas fa-circle-user"></i>
              </q-item-section>
              <q-item-section>
                <div>
                  <q-item-label class="chat-header-chat-name">Chat name</q-item-label>
                </div>
                <div>
                  <q-item-label class="chat-header-active-status">Active</q-item-label>
                </div>
              </q-item-section>
            </q-item>
          </div>

          <div class="chat-content">
            <div class="chat-bubble-row incoming">
              <q-bubble class="bubble">
                This is an incoming message!
              </q-bubble>
              <q-bubble class="bubble">
                This is an incoming message! This is an incoming message! This is an incoming message!
              </q-bubble>
            </div>

            <div class="chat-bubble-row outgoing">
              <q-bubble class="bubble">
                This is an outgoing message!
              </q-bubble>
              <q-bubble class="bubble">
                This is an outgoing message!
              </q-bubble>
              <q-bubble class="bubble">
                This is an outgoing message! This is an outgoing message! This is an outgoing message! This is an outgoing message! This is an outgoing message!
              </q-bubble>
            </div>
          </div>

          <div class="chat-footer">
            <q-item class="photos">
              <q-item-section>
                <i class="far fa-image"></i>
              </q-item-section>
            </q-item>
            <q-input rounded standout dense v-model="text" placeholder="Aa" class="text-bar" />
            <transition name="fade" appear>
            <q-item v-if="text.length > 0" class="send">
              <q-item-section>
                <i class="fas fa-paper-plane"></i>
              </q-item-section>
            </q-item>
          </transition>
          </div>
        </div>
      </q-page>
</template>

<script setup scoped lang="ts">
import { ref } from 'vue';

const text = ref<string>('')
</script>
