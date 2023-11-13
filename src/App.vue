<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import {
  CoinbaseWalletConnector,
  Connector,
  MetaMaskConnector,
  SafeConnector,
  WalletConnectConnector,
  useWallet,
} from "vue-dapp";
import LayoutHeader from "./components/LayoutHeader.vue";

const { onDisconnect, onAccountsChanged, onChainChanged } = useWallet();

const infuraId = import.meta.env.VITE_INFURA_KEY;
const connectorsCreated = ref(false);

let connectors: Connector[] = [
  new MetaMaskConnector({
    appUrl: "http://localhost:3000",
  }),
  new WalletConnectConnector({
    projectId: "3f3c98042b194264687bf59e104c534a",
    chains: [1],
    showQrModal: true,
    qrModalOptions: {
      themeMode: "dark",
      themeVariables: undefined,
      //chainImages: undefined,
      desktopWallets: undefined,
      walletImages: undefined,
      mobileWallets: undefined,
      enableExplorer: true,
      //explorerAllowList: undefined,
      //tokenImages: undefined,
      privacyPolicyUrl: undefined,
      //explorerDenyList: undefined,
      termsOfServiceUrl: undefined,
    },
  }),
  new CoinbaseWalletConnector({
    appName: "Vue Dapp",
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
];

onDisconnect(() => {
  console.log("disconnect");
});

onDisconnect(() => {
  console.log("disconnect");
});

onAccountsChanged(() => {
  console.log("accounts changed");
});

onChainChanged((chainId: any) => {
  console.log("chain changed", chainId);
});

onBeforeMount(async () => {
  const safe = new SafeConnector();

  try {
    if (await safe.isSafeApp()) {
      connectors = [safe];
    }
  } catch (err: any) {
    console.error(err);
  }

  connectorsCreated.value = true;
});

const autoConnectErrorHandler = (err: any) => {
  console.error(err);
};

const connectErrorHandler = (err: any) => {
  console.error(err);
};
</script>

<template>
  <layout-header />
  <router-view></router-view>
  <vd-board
    v-if="connectorsCreated"
    :connectors="connectors"
    dark
    :autoConnectErrorHandler="autoConnectErrorHandler"
    :connectErrorHandler="connectErrorHandler"
  />
</template>
