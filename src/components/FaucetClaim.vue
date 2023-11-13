<template>
  <div id="commands" class="rounded shadow">
    <h2>Ethereum SiliquaCoin Faucet</h2>
    <p>Claim 1 SiliquaCoin per day from the faucet</p>
    <div
      class="container"
      style="
        padding-top: 36px;
        padding-bottom: 16px;
        border-radius: 24px 24px 0px 0px;
        position: relative;
      "
    >
      <div style="position: absolute; top: 0px; left: 0px"></div>
      <div class="row">
        <div class="col">
          <form class="form" @submit.prevent="claimTokens">
            <div class="flex row">
              <div
                class="col-md-9 col-sm-12 flex-grow"
                style="padding-right: 3px; display: flex"
              >
                <input
                  class="input"
                  placeholder="Connect to Your Wallet Address (0x...) using Metamask"
                  type="text"
                  v-model="address"
                  :disabled="true"
                />
              </div>
              <div class="col-md-3 col-sm-12">
                <button type="submit" class="btn btn-blue btn-lg">
                  <span>Send Me SILQ</span>
                </button>
              </div>
            </div>
          </form>
          <p class="success" v-if="claimSuccess">{{ claiming }}</p>
          <p class="failure" v-if="!claimSuccess">{{ claimError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup lang="ts">
import { ref } from "vue";
import { useEthers } from "vue-dapp";
import { ethers } from "ethers";
import contractAbi from "../contracts/SiliquaCoin.json";

const infuraId: string = import.meta.env.VITE_INFURA_KEY;
const { address } = useEthers();

const networks = {
  80001: {
    chainId: ethers.utils.hexValue(80001),
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    chainName: "Mumbai",
    rpcUrls: [`https://polygon-mumbai.infura.io/v3/${infuraId}`],
    nativeCurrency: {
      name: "Mumbai",
      decimals: 18,
      symbol: "MATIC",
    },
  },
  42161: {
    chainId: ethers.utils.hexValue(42161),
    blockExplorerUrls: ["https://arbiscan.io"],
    chainName: "Arbitrum One",
    rpcUrls: [`https://arbitrum-sepolia.infura.io/v3/${infuraId}`],
    nativeCurrency: {
      name: "Arbitrum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  11155111: {
    chainId: ethers.utils.hexValue(11155111),
    blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    chainName: "Sepolia",
    rpcUrls: [`https://sepolia.infura.io/v3/${infuraId}`],
    nativeCurrency: {
      name: "Sepolia",
      symbol: "SepoliaETH",
      decimals: 18,
    },
  },
  1337: {
    chainId: ethers.utils.hexValue(1337),
    chainName: "Ganache",
    rpcUrls: ["HTTP://127.0.0.1:7545"],
    nativeCurrency: {
      name: "Ganache",
      symbol: "GanacheETH",
      decimals: 18,
    },
  },
};

const activeNetwork = networks[11155111];
const contractAddress: string = import.meta.env.VITE_ERC20_CONTRACT_ADDRESS;

const claimError = ref("");
const claimSuccess = ref(false);
const claiming = ref("");

async function claimTokens() {
  try {
    if (!contractAddress) {
      console.log("Please set the ERC20_CONTRACT_ADDRESS env variable.");
      claimError.value = "Please set the ERC20_CONTRACT_ADDRESS env variable.";
      return;
    }

    if (!address.value) {
      console.log("Please connect to your wallet.");
      claimError.value = "Please connect to your wallet.";
      return;
    }

    // Configuring the connection to an Ethereum node
    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);

    // Creating a signing account from a private key
    const signer = provider.getSigner();
    console.log("signer: " + (await signer.getAddress()));

    // Creating a contract instance
    const abi = contractAbi.abi;
    const erc20 = new ethers.Contract(contractAddress, abi, signer);
    console.log(await erc20.name());
    console.log(await erc20.symbol());

    // Creating and sending the transaction object
    const tx = await erc20.claimTokens();

    console.log("Mining transaction...");
    console.log(`${activeNetwork.blockExplorerUrls}/tx/${tx.hash}`);

    // Waiting for the transaction to be mined
    const receipt = await tx.wait();

    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
    console.log("claiming tokens");
    console.log(tx);

    claimSuccess.value = true;
    claiming.value = "Tokens claimed successfully";
    return Promise.resolve(tx);
  } catch (error: any) {
    if (error?.reason) {
      claimError.value = error.reason;
    } else {
      claimError.value = "An error occurred while claiming tokens.";
    }
    claimSuccess.value = false;
    console.error(JSON.stringify(error, null, 2));
  }
}
</script>
