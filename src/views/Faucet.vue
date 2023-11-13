<script setup lang="ts">
import { ref } from "vue";
import { useEthers } from "vue-dapp";
import { ethers } from "ethers";
import Token from "../components/Token.vue";
import contractAbi from "../contracts/SiliquaCoin.json";

const infuraId: string = import.meta.env.VITE_INFURA_KEY;
const { chainId, address } = useEthers();

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
const TOKEN_TO_ETH_RATE = 0.001;

const claimError = ref("");
const claimSuccess = ref(false);
const claiming = ref("");

const ethAmount = ref(0);
const buyError = ref("");
const buyingSuccess = ref(false);
const buying = ref("");

function calculateEthEquivalent() {
  if (ethAmount.value && !isNaN(parseFloat(ethAmount.value.toString()))) {
    const userEnteredAmount = parseFloat(ethAmount.value.toString());
    const equivalentEth = userEnteredAmount * TOKEN_TO_ETH_RATE;
    return equivalentEth.toFixed(3);
  }
  return "0.000";
}

async function buyTokens() {
  try {
    if (!contractAddress) {
      console.log("Please set the ERC20_CONTRACT_ADDRESS env variable.");
      buyError.value = "Please set the ERC20_CONTRACT_ADDRESS env variable.";
      return;
    }

    if (!address.value) {
      console.log("Please connect to your wallet.");
      buyError.value = "Please connect to your wallet.";
      return;
    }

    // Configuring the connection to an Ethereum node
    const provider = new ethers.providers.InfuraProvider(
      activeNetwork.chainName.toLowerCase(),
      infuraId
    );

    const latest_block = await provider.getBlockNumber();
    console.log("Latest block number:", latest_block);

    await provider.send("eth_requestAccounts", []);

    // Creating a signing account from a private key
    const signer = provider.getSigner(address.value);

    // Creating and sending the transaction object
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(calculateEthEquivalent().toString()), // Convert ETH to wei
    });

    console.log("Mining transaction...");
    console.log(`${activeNetwork.blockExplorerUrls}/tx/${tx.hash}`);

    // Waiting for the transaction to be mined
    const receipt = await tx.wait();

    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);

    buyingSuccess.value = true;
    buying.value = "Tokens bought successfully";
    return Promise.resolve(tx);
  } catch (error: any) {
    if (error?.error?.error?.data) {
      console.error(JSON.stringify(error.error.error.data.reason, null, 2));
      buyError.value = error.error.error.data.reason;
    } else {
      const errorString = error.message || JSON.stringify(error, null, 2);
      if (errorString.includes("INSUFFICIENT_FUNDS")) {
        buyError.value = "You don't have enough ETH to buy SILQ";
      } else {
        buyError.value = "An error occurred while buying tokens.";
      }
      console.error("An error occurred while buying tokens:", errorString);
    }
    buyingSuccess.value = false;
  }
}

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

    const provider = new ethers.providers.JsonRpcProvider(
      activeNetwork.rpcUrls[0]
    );
    const signer = provider.getSigner(address.value);
    console.log(await signer.getAddress());
    const network = await provider.getNetwork();
    console.log(network.chainId);
    const abi = contractAbi.abi;
    const currentContract = new ethers.Contract(contractAddress, abi, signer);
    console.log(await currentContract.name());
    console.log(await currentContract.symbol());

    const tx = await currentContract.claimTokens();
    console.log("claiming tokens");
    console.log(tx);

    claimSuccess.value = true;
    claiming.value = "Tokens claimed successfully";
    return Promise.resolve(tx);
  } catch (error: any) {
    if (error?.error?.error?.data) {
      console.error(JSON.stringify(error.error.error.data.reason, null, 2));
      claimError.value = error.error.error.data.reason;
    } else {
      console.error(
        "An error occurred while claiming tokens:",
        error.message || JSON.stringify(error, null, 2)
      );
      claimError.value = "An error occurred while claiming tokens.";
    }
    claimSuccess.value = false;
  }
}
</script>

<template>
  <div class="wrapper">
    <div class="container">
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
      <div id="commands" class="rounded shadow">
        <h2>Buy SiliquaCoin</h2>
        <p>Each SILQ is equivalent to 0,001 ETH</p>
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
              <form class="form" @submit.prevent="buyTokens">
                <div class="flex row">
                  <div
                    class="col-md-9 col-sm-12 flex-grow"
                    style="padding-right: 3px; display: flex"
                  >
                    <input
                      class="input"
                      placeholder="Introduce the amount of SILQ you want to buy"
                      type="number"
                      step="1"
                      min="1"
                      v-model="ethAmount"
                    />
                  </div>
                  <div class="col-md-3 col-sm-12">
                    <button type="submit" class="btn btn-blue btn-lg">
                      <span>Buy SILQ</span>
                    </button>
                  </div>
                </div>
              </form>
              <p class="conversion-label" v-if="ethAmount">
                Equivalent to: {{ calculateEthEquivalent() }} ETH
              </p>
              <p class="success" v-if="buyingSuccess">{{ buying }}</p>
              <p class="failure" v-if="!buyingSuccess">{{ buyError }}</p>
            </div>
          </div>
        </div>
      </div>
      <div id="commands" class="rounded shadow">
        <h2>Detail Information</h2>
        <p>Token information</p>
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
    </div>
  </div>
</template>

<style scoped></style>
