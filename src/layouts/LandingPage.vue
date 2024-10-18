<template>
  <q-layout view="hHh lpr fff">

    <HeaderLayout/>

    <q-page-container>
      <div class="left-container">
        <q-label class="title">
          Stay connected anytime,<br />anywhere
        </q-label>
        <q-paragraph class="paragraph">
          Discover a new way to chat and share moments with friends and family—effortless, engaging, and always at your fingertips.
        </q-paragraph>
        <div class="buttons">
          <q-btn unelevated rounded label="Join now" to="/register" no-caps class="join-btn" />
          <q-btn flat rounded label="Log in" to="/login" no-caps class="log-btn" />
        </div>
      </div>
      <div class="right-container">
      </div>
    </q-page-container>

    <FooterLayout/>

  </q-layout>
</template>

<script scoped setup lang="ts">

import HeaderLayout from 'src/components/HeaderLayout.vue';
import FooterLayout from 'src/components/FooterLayout.vue';

</script>


<style scoped lang="scss">
* {
  color: $font !important;

  body.body--light & {
    color: $l-font !important;
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

  body.body--light & {
    background-color: $l-primary !important;
  }

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
      background: $title !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      line-height: 1.3;
      padding-bottom: 30px;

      body.body--light & {
        background: $l-title !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
      }
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

      body.body--light & {
        background: $l-chat-bubble-outgoing !important;
      }
    }

    .log-btn {
      text-decoration: underline;
    }
  }
}

@media (max-height: 650px) {
  .left-container {
    padding-top: 50px !important;
    padding-bottom: 50px !important;
  }
}

@media (max-width: 600px) {
  .left-container {
    padding-left: 50px !important;
    padding-right: 50px !important;
  }
}
</style>
