<template>
  <q-layout view="hHh lpr fFf">
    <q-header>
      <img src="../assets/logo.png" alt="Convo's logo">
      <div class="header-links">
        <a href="#">What's new</a>
        <a href="#">About us</a>
        <a href="#">Contact us</a>
      </div>
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
          <q-btn unelevated rounded label="Join now" to="/app" no-caps class="join-btn" />
          <q-btn flat rounded label="Log in" to="/login" no-caps class="log-btn" />
        </div>
      </div>
      <div class="right-container">
      </div>
    </q-page-container>

    <q-footer>
      <q-label>Convo © 2024 Erik Roganský, Peter Sartoris. All rights reserved.</q-label>
      <div class="footer-links">
        <a href="/cookie-policy">Cookie Policy</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-and-conditions">Terms & Conditions</a>
      </div>
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

.q-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.q-page-container {
  background-color: $primary;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: center;

  .left-container {
    width: 720px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    padding: 0 125px;

    .title {
      font-size: 56px;
      font-weight: bolder;
      background: $title;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.3;
      padding-bottom: 30px;
    }

    .paragraph {
      font-size: 16px;
      padding-bottom: 30px;
    }
  }

  .right-container {
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .buttons {
    display: flex;
    flex-direction: row;

    * {
      font-size: 15px;
      font-weight: 400;
    }

    .join-btn {
      background: $chat-bubble-outgoing;
      margin-right: 10px;
      padding-left: 20px;
      padding-right: 20px;
    }

    .log-btn {
      text-decoration: underline;
    }
  }
}
</style>
