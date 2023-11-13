<template>
  <button @click="recaptcha">Execute recaptcha</button>
</template>

<script>
import { useReCaptcha } from "vue-recaptcha-v3";

export default {
  name: "App",
  setup() {
    const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

    const recaptcha = async () => {
      // (optional) Wait until recaptcha has been loaded.
      await recaptchaLoaded();

      // Execute reCAPTCHA with action "login".
      const token = await executeRecaptcha("login");

      // Do stuff with the received token.
      console.log({ token });
    };

    return {
      recaptcha,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
