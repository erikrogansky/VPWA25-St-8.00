<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
    </q-header>

    <q-page-container>
      <div class="left-container">
        <q-label class="title">
          Stay connected anytime,<br />anywhere
        </q-label>
        <q-paragraph class="paragraph">
          Discover a new way to chat and share moments with friends and family—effortless, engaging, and always at your fingertips.
        </q-paragraph>
        <div class="buttons">
          <q-btn unelevated rounded label="Join now" />
          <q-btn flat rounded label="Log in (access app through here)" to="/app" />
        </div>
      </div>
      <div class="right-container">
        perojgwropvj
      </div>
    </q-page-container>

    <q-footer>

    </q-footer>

  </q-layout>
</template>

<script scoped setup lang="ts">


</script>


<style scoped lang="scss">
* {
  color: $font;
}

.q-header {
  height: 75px;
}
.q-footer {
  height: 75px;
}

.q-page-container {
  background-color: $primary;
  display: flex;
  flex-direction: row;
  height: 100%;

  .left-container {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 150px 125px;

    .title {
      font-size: 56px;
      font-weight: bolder;
      background: $title; /* Replace with your gradient colors */
      -webkit-background-clip: text; /* Clip the background to the text */
      -webkit-text-fill-color: transparent; /* Make the text fill transparent */
      line-height: 1.3;
      padding-bottom: 30px;
    }

    .paragraph {
      font-size: 16px;
      padding-bottom: 30px;
    }
  }

  .right-container {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .buttons {
    display: flex;
    flex-direction: row;
  }
}
</style>
