<template>
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
            Equivalent to: {{ amountFixed() }} ETH
          </p>
          <p class="success" v-if="buyingSuccess">{{ buying }}</p>
          <p class="failure" v-if="!buyingSuccess">{{ buyError }}</p>
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

const { address } = useEthers();

const contractAddress: string = import.meta.env.VITE_ERC20_CONTRACT_ADDRESS;
const TOKEN_TO_ETH_RATE = 0.001;

const ethAmount = ref(0);
const buyError = ref("");
const buyingSuccess = ref(false);
const buying = ref("");

function calculateEthEquivalent() {
  if (ethAmount.value && !isNaN(parseFloat(ethAmount.value.toString()))) {
    const userEnteredAmount = parseFloat(ethAmount.value.toString());
    const equivalentEth = userEnteredAmount * TOKEN_TO_ETH_RATE;
    return equivalentEth;
  }
  return 0;
}

function amountFixed() {
  return calculateEthEquivalent().toFixed(3);
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
    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);

    // Creating a signing account from a private key
    const signer = provider.getSigner();
    console.log("signer: " + (await signer.getAddress()));

    // send transaction
    const tx = await signer.sendTransaction({
      to: contractAddress,
      value: ethers.utils.parseEther(calculateEthEquivalent().toString()),
    });

    buyingSuccess.value = true;
    buying.value = "Tokens bought successfully";
    return Promise.resolve(tx);
  } catch (error: any) {
    if (error?.reason) {
      buyError.value = error.reason;
    } else {
      buyError.value = "An error occurred while buying tokens.";
    }
    buyingSuccess.value = false;
    console.error(JSON.stringify(error, null, 2));
  }
}
</script>
