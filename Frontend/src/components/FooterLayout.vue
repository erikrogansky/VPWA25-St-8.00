<template>
  <q-footer>
    <label class="copyright q-label">Convo © 2024 Erik Roganský, Peter Sartoris. All rights reserved.</label>
    <div class="footer-links">
      <router-link to="/cookie-policy">Cookie Policy</router-link>
      <router-link to="/privacy-policy">Privacy Policy</router-link>
      <router-link to="/terms-and-conditions">Terms & Conditions</router-link>
    </div>
  </q-footer>
</template>

<style scoped lang="scss">
* {
  color: var(--font);
}

.q-footer {
  height: 75px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 75px;

  /* [data-theme='light'] & {
    box-shadow: 0px 7px 22px rgba(0,0,0, 0.2);
  } */

  .footer-links {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 375px;
  }
}

@media (max-width: 1000px) {
    .q-footer {
      height: 90px;

      .footer-links {
        flex-direction: column;
        width: auto;
        padding-right: 20px;

        a {
          padding-bottom: 6px;
        }
      }
    }

    .copyright {
      width: 225px;
    }
  }


  @media (max-width: 550px) {
    .q-footer {
      height: 80px;
      flex-direction: column;

      .footer-links {
        flex-direction: row;
        width: 350px;
        padding-right: 20px;

        a {
          padding-bottom: 6px;
        }
      }
    }

    .copyright {
      width: 225px;
    }
  }

</style>
