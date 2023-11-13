<script lang="ts">
import { defineComponent } from "vue";
import { useEthers, useEthersHooks } from "vue-dapp";
import { useToken } from "../composables/useToken";

const tokenAddress = import.meta.env.VITE_ERC20_CONTRACT_ADDRESS;

export default defineComponent({
  name: "Token",
  setup() {
    const { address, isActivated } = useEthers();
    const { call, name, totalSupply, decimals, symbol, balance } = useToken();
    const { onActivated, onDeactivated, onChanged } = useEthersHooks();

    onActivated(({ provider, address }) => {
      call(provider, tokenAddress, address);
    });

    onDeactivated(() => {
      console.log("deactivated");
    });

    onChanged(() => {
      console.log("change");
    });

    return {
      isActivated,
      address,
      name,
      totalSupply,
      decimals,
      symbol,
      balance,
    };
  },
});
</script>

<template>
  <div v-if="isActivated" class="flex flex-col justify-start mx-0 px-0">
    <p>name: {{ name }}</p>
    <p>totalSupply: {{ totalSupply }}</p>
    <p>decimals: {{ decimals }}</p>
    <p>symbol: {{ symbol }}</p>
    <p>balance: {{ balance }}</p>
  </div>
</template>
