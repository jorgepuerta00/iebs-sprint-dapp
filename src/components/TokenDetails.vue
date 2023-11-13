<template>
  <div id="commands" class="rounded shadow">
    <h2>Detail Information</h2>
    <p>SILQ Token information</p>
    <div
      class="container"
      style="
        padding-top: 10px;
        padding-bottom: 16px;
        border-radius: 24px 24px 0px 0px;
        position: relative;
      "
    >
      <div style="position: absolute; top: 0px; left: 0px"></div>
      <div class="row">
        <div class="col">
          <Token />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import Token from "./shared/Token.vue";
</script>
