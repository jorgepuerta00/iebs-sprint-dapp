import { ref } from 'vue'
import { Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import contractAbi from "../contracts/SiliquaCoin.json";

export function useToken() {
	const name = ref('')
	const totalSupply = ref(BigInt(0))
	const decimals = ref(0)
	const symbol = ref('')
	const balance = ref(BigInt(0))

	async function call(provider: Web3Provider, tokenAddress: string, userAddress: string) {
		try {
			const abi = contractAbi.abi;
			const erc20 = new ethers.Contract(tokenAddress, abi, provider);

			name.value = await erc20.name();
			totalSupply.value = ethers.utils.formatUnits(await erc20.totalSupply()) as unknown as bigint;
			decimals.value = await erc20.decimals()
			symbol.value = await erc20.symbol()
			balance.value = (await erc20.balanceOf(userAddress) as BigNumber).toBigInt()
		}
		catch (error) {
			console.error("an error occurred while calling the token contract")
		}
	}

	return {
		name,
		totalSupply,
		decimals,
		balance,
		symbol,
		call,
	}
}
