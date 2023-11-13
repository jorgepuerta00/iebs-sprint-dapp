<script setup lang="ts">
import {
  useBoard,
  useEthers,
  useWallet,
  displayEther,
  shortenAddress,
  useEthersHooks,
  displayChainName,
} from "vue-dapp";
import { ref, watch } from "vue";
import Dropdown from "./Dropdown.vue";

const { open } = useBoard();
const { address, balance, chainId, isActivated, dnsAlias } = useEthers();
const { wallet, disconnect } = useWallet();

const { onActivated, onChanged } = useEthersHooks();

const { availableNetworks } = useEthers();
const supportedChainId = Object.keys(availableNetworks.value).map((key) =>
  Number(key)
);

const navigation: { name: string; href: string }[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Buy a Horse",
    href: "/buy-a-horse",
  },
  {
    name: "Faucet",
    href: "/faucet",
  },
  {
    name: "Herd",
    href: "/herd",
  },
  {
    name: "Racecourses",
    href: "/racecourses",
  },
  {
    name: "Provenance",
    href: "/provenance",
  },
  {
    name: "Team",
    href: "/team",
  },
];

onActivated(() => {
  selectedChainId.value = chainId.value as number;
});

const selectedChainId = ref(0);

const isChainChanged = ref(false);
onChanged(() => {
  selectedChainId.value = chainId.value as number;
  isChainChanged.value = true;
});

const switchError = ref(false);
watch(selectedChainId, async (val, oldVal) => {
  if (oldVal === 0) return;
  if (switchError.value) {
    switchError.value = false;
    return;
  }

  try {
    if (wallet.connector) {
      await wallet.connector.switchChain!(val);
    }
  } catch (e: any) {
    switchError.value = true;
    selectedChainId.value = oldVal;
    console.error(e);
  }
});
</script>

<template>
  <header class="w-full px-4">
    <div class="flex-grow justify-between p-4 px-3">
      <nav class="w-full">
        <div class="flex items-center justify-between">
          <router-link
            to="/"
            active-class="text-gray-900"
            class="text-xl text-gray-600"
          >
            <div class="flex space-x-4 items-center">
              <!-- logo -->
              <img
                class="h-10 min-w-10"
                src="../../assets/logo.png"
                alt="logo"
              />
              <p class="hover:text-gray-900">Racecourses Dapp</p>
            </div>
          </router-link>

          <div class="flex items-center space-x-10">
            <!-- router -->
            <router-link
              v-for="link in navigation"
              :key="link.name"
              :to="link.href"
              active-class="text-gray-900"
              exact
              class="text-gray-600 hover:text-gray-900"
            >
              {{ link.name }}
            </router-link>

            <div v-if="isActivated" class="flex items-center flex-col">
              <!-- Account -->
              <div
                class="sm:hidden py-2 px-3 rounded-2xl inline-block bg-gray-100"
              >
                {{ shortenAddress(address) }}
              </div>

              <div
                class="hidden sm:flex py-1 px-2 items-center rounded-3xl border border-solid"
              >
                <div class="px-1 mr-1">{{ displayEther(balance) }} ETH</div>
                <div class="py-2 px-3 rounded-2xl inline-block bg-gray-100">
                  {{ shortenAddress(address) }}
                </div>
              </div>
            </div>

            <button
              v-else
              @click="open()"
              class="btn"
              :disabled="wallet.status === 'connecting'"
            >
              {{
                wallet.status === "connecting"
                  ? "Connecting..."
                  : wallet.status === "loading"
                  ? "Loading..."
                  : "Connect"
              }}
            </button>
          </div>
        </div>
      </nav>
    </div>

    <div
      class="centered flex flex-col items-center"
      v-if="isActivated"
      style="position: absolute; right: 35px"
    >
      <div class="centered">
        <button @click="disconnect" class="btn-gray">Disconnect</button>
      </div>
      <p>DNS alias(such as ENS): {{ dnsAlias || "-" }}</p>
      <div class="centered mt-2">
        <Dropdown
          :options="supportedChainId"
          v-model:selected="selectedChainId"
          :filter-fn="displayChainName"
        ></Dropdown>
      </div>
    </div>
  </header>
</template>
