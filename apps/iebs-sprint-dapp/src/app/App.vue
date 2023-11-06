<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import {
CoinbaseWalletConnector,
Connector,
MetaMaskConnector,
SafeConnector,
WalletConnectConnector,
displayChainName,
useEthers,
useEthersHooks,
useWallet
} from 'vue-dapp';
import NxWelcome from './NxWelcome.vue';
import Dropdown from './components/Dropdown.vue';
import LayoutHeader from './components/LayoutHeader.vue';

const { wallet, onDisconnect, onAccountsChanged, onChainChanged } = useWallet()
const { address, balance, chainId, isActivated, dnsAlias } = useEthers()
const { onActivated, onChanged } = useEthersHooks()

const isDev = import.meta.env.DEV
const infuraId = isDev ? import.meta.env.VITE_INFURA_KEY : 'ff6a249a74e048f1b413cba715f98d07'

let connectors: Connector[] = [
  new MetaMaskConnector({
    appUrl: 'http://localhost:3000',
  }),
  new WalletConnectConnector({
    projectId: '3f3c98042b194264687bf59e104c534a',
    chains: [1],
    showQrModal: true,
    qrModalOptions: {
      themeMode: 'dark',
      themeVariables: undefined,
      chainImages: undefined,
      desktopWallets: undefined,
      walletImages: undefined,
      mobileWallets: undefined,
      enableExplorer: true,
      explorerAllowList: undefined,
      tokenImages: undefined,
      privacyPolicyUrl: undefined,
      explorerDenyList: undefined,
      termsOfServiceUrl: undefined,
    },
  }),
  new CoinbaseWalletConnector({
    appName: 'Vue Dapp',
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
]

const connectorsCreated = ref(false)

onDisconnect(() => {
	console.log('disconnect')
})

onActivated(() => {
	selectedChainId.value = chainId.value as number
})

onDisconnect(() => {
	console.log('disconnect')
})

onAccountsChanged(() => {
	console.log('accounts changed')
})

onChainChanged((chainId: any) => {
	console.log('chain changed', chainId)
})

onBeforeMount(async () => {
  const safe = new SafeConnector()

  try {
    if (await safe.isSafeApp()) {
      connectors = [safe]
    }
  } catch (err: any) {
    console.error(err)
  }

  connectorsCreated.value = true
})

const autoConnectErrorHandler = (err: any) => {
  console.error(err)
}

const connectErrorHandler = (err: any) => {
  console.error(err)
}

const { availableNetworks } = useEthers()
const supportedChainId = Object.keys(availableNetworks.value).map(key => Number(key))
const selectedChainId = ref(0)

const isChainChanged = ref(false)
onChanged(() => {
	selectedChainId.value = chainId.value as number
	isChainChanged.value = true
})

// For turning back to previous chainId without calling switchChain() again
const switchError = ref(false)
watch(selectedChainId, async (val, oldVal) => {
	if (oldVal === 0) return // ignore initial change
	if (switchError.value) {
		switchError.value = false
		return
	}

	try {
		if (wallet.connector) {
			await wallet.connector.switchChain!(val)
		}
	} catch (e: any) {
		switchError.value = true
		selectedChainId.value = oldVal
		console.error(e)
	}
})

</script>

<template>
  <layout-header />
  <router-view></router-view>
  <div v-if="isActivated" class="text-center">
    <p>DNS alias(such as ENS): {{ dnsAlias || '-' }}</p>
    <!-- Network -->
    <Dropdown
      class="mt-2"
      :options="supportedChainId"
      v-model:selected="selectedChainId"
      :filter-fn="displayChainName"
    ></Dropdown>
  </div>
  <NxWelcome title="iebs-sprint-dapp" />
  <vd-board
    v-if="connectorsCreated"
    :connectors="connectors"
    dark
    :autoConnectErrorHandler="autoConnectErrorHandler"
    :connectErrorHandler="connectErrorHandler"
  />
</template>
