<template>
  <q-footer>
    <q-label>Convo © 2024 Erik Roganský, Peter Sartoris. All rights reserved.</q-label>
    <div class="footer-links">
      <a href="/cookie-policy">Cookie Policy</a>
      <a href="/privacy-policy">Privacy Policy</a>
      <a href="/terms-and-conditions">Terms & Conditions</a>
    </div>
  </q-footer>
</template>

<style scoped lang="scss">
* {
  color: $font;
}

.q-footer {
  height: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 75px;

  .footer-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 375px;
  }
}
</style>
