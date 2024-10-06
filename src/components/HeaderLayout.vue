<template>
  <q-header>
    <img src="../assets/logo.png" alt="Convo's logo">
    <div class="header-links">
      <a href="#">What's new</a>
      <a href="#">About us</a>
      <a href="#">Contact us</a>
    </div>
  </q-header>
</template>

<style scoped lang="scss">
* {
  color: $font;
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
</style>
