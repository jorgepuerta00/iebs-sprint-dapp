<script setup lang="ts">
import ClaimSiliquaCoin from "./../components/FaucetClaim.vue";
import BuySiliquaCoin from "./../components/BuySiliquaCoin.vue";
import TokenDetails from "./../components/TokenDetails.vue";
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <BuySiliquaCoin />
      <ClaimSiliquaCoin />
      <TokenDetails />
    </div>
  </div>
</template>

<style scoped></style>
