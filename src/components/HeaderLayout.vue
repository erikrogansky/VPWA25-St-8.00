<template>
  <q-header>
    <img :src="logoSource" alt="Convo's logo">
    <div class="header-links">
      <a href="#">What's new</a>
      <a href="#">About us</a>
      <a href="#">Contact us</a>
    </div>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const logoSource = computed(() => {
  return $q.dark.isActive
    ? '/src/assets/logo.png'
    : '/src/assets/l-logo.png';
});
</script>

<style scoped lang="scss">
* {
  color: $font !important;
}

body.body--light * {
    color: $l-font !important;
}

.q-header {
  height: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 75px 0 75px;

  img {
    height: 60px;
  }

  .header-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 250px;

    a {
      text-decoration: none;
    }
  }
}

@media (max-width: 550px) {
    .q-header {
      padding: 10px 25px 0 25px;
    }
  }

  @media (max-width: 340px) {
    img {
      display: none;
    }

    .q-header {
      justify-content: center;
    }
  }
</style>
