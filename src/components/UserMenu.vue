<template>
  <q-menu class="user-popup">
    <q-list style="min-width: 290px; height: auto;">
      <q-item clickable v-close-popup>
        <q-item-section avatar><i class="fas fa-gear"></i></q-item-section>
        <q-item-section>Preferences</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section avatar><i class="fas fa-circle-question"></i></q-item-section>
        <q-item-section>Help</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup>
        <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
        <q-item-section>Terms & Conditions</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
        <q-item-section>Privacy Policy</q-item-section>
      </q-item>
      <q-item clickable v-close-popup>
        <q-item-section avatar><i class="fas fa-align-left"></i></q-item-section>
        <q-item-section>Cookie Policy</q-item-section>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup to="/">
        <q-item-section avatar><i class="fas fa-right-from-bracket"></i></q-item-section>
        <q-item-section>Log out</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>
