import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueDapp } from 'vue-dapp'
import { ethers } from 'ethers'
const infuraId = import.meta.env.VITE_INFURA_KEY;

import './style.css'

const app = createApp(App)

app.use(router)
app.use(VueDapp, {
  autoConnect: true,
  dumb: false,
  networks: {
    80001: {
      chainId: ethers.utils.hexValue(80001),
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      chainName: 'Mumbai',
      rpcUrls: [`https://polygon-mumbai.infura.io/v3/${infuraId}`],
      nativeCurrency: {
        name: 'Mumbai',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    42161: {
      chainId: ethers.utils.hexValue(42161),
      blockExplorerUrls: ['https://arbiscan.io'],
      chainName: 'Arbitrum One',
      rpcUrls: [`https://arbitrum-sepolia.infura.io/v3/${infuraId}`],
      nativeCurrency: {
        name: 'Arbitrum',
        symbol: 'ETH',
        decimals: 18,
      },
    },
    11155111: {
      chainId: ethers.utils.hexValue(11155111),
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
      chainName: 'SePolia',
      rpcUrls: [`https://sepolia.infura.io/v3/${infuraId}`],
      nativeCurrency: {
        name: 'SePolia',
        symbol: 'SepoliaETH',
        decimals: 18,
      },
    },
    1337: {
      chainId: ethers.utils.hexValue(1337),
      chainName: 'Ganache',
      rpcUrls: ['HTTP://127.0.0.1:7545'],
      nativeCurrency: {
        name: 'Ganache',
        symbol: 'GanacheETH',
        decimals: 18,
      },
    },
  },
})

app.mount('#root')
