# NFT Sleep Minting Agent

## Description

A Forta Agent to detect transactions that may indicate NFT Sleep Minting.

Sleep Minting is when an attacker mints an NFT directly to a famous creator's wallet with permissions to reclaim or pull the NFT back out of the creator's wallet. This creates the appearance that (1) a famous creator minted an NFT to themselves, and (2) the creator sent that NFT to an attacker. Based on “on-chain” provenance, the attacker can claim they own an NFT created by a famous artist and sell it for a high value.

You can read more about what this is and why it matters [here](https://a16z.com/2022/03/09/sleep-minting-nfts/)

Documentation for how to build your own Forta Agent can be found [here](https://docs.forta.network/en/latest/)

You can see this agent live [here](https://explorer.forta.network/agent/0x20d0cd9432c7e15cb625097a718c15cc07f463b5252e3c36ae23acb7ef98d54e)

## Install

- `git clone https://github.com/a16z/nft-sleep-mint-forta-agent.git`
- `cd nft-sleep-mint-forta-agent`
- `npm install .`

## Supported Chains

- Ethereum

## Alerts

- SLEEPMINT-1
  - Fired when an NFT is transferred by an address that is not the owner of the NFT according to an NFT Transfer event.
    - i.e., the transaction sender != the `from` argument in an emitted Transfer() event
  - Severity is always set to "info"
    - This type of transfer may be OK. There are cases where an address is approved to transfer an NFT on another person's behalf.
  - Type is always set to "suspicious"
- SLEEPMINT-2
  - Fired when there is an NFT approval where the address that sent the approval transaction is different from the current NFT owner. This would be malicious if someone mints an NFT to a famous artist but maintains the permissions to pull that NFT back out of the famous artist's wallet.
  - Severity is always set to "medium."
  - Type is always set to "suspicious."

## Test Data

Create a file named `forta.config.json` in the root of the project directory that contains your own RPC endpoint from [Alchemy](https://www.alchemy.com/). See the example below. Note, use an appropriate endpoint for the chain you are looking to test. For example, use a Rinkeby endpoint to test a Rinkeby transaction hash or a Mainnet endpoint to test a Mainnet transaction hash.

```
{
    "jsonRpcUrl": YOUR_RPC_ENDPOINT_HERE
}
```

The agent behavior can be verified with the following transactions:

- SLEEPMINT-1 (Mainnet): 0x57f23fde8e4221174cfb1baf68a87858167fec228d9b32952532e40c367ef04e
- SLEEPMINT-1 (Rinkeby): 0x3fdd4435c13672803490eb424ca93094b461ae754bd152714d5b5f58381ccd4b
- SLEEPMINT-2 (Rinkeby): 0x53aa1bd7fa298fa1b96eeed2a4664db8934e27cd28ac0001a5bf5fa3b30c6360

To test a transaction hash run the command: `npm run tx <TRANSACTION HASH>`. For example,

```
npm run tx 0x57f23fde8e4221174cfb1baf68a87858167fec228d9b32952532e40c367ef04e
```

## Real Example Sleep Mint

Here is the smart contract that sleep minted Beeple's "First 5000 Days" NFT: https://etherscan.io/address/0x5fbbacf00ef20193a301a5ba20acf04765fb6dac

## Testnet Example Sleep Mint

I deployed a simple [smart contract](https://rinkeby.etherscan.io/address/0x43A87F4a18db7b342C9FeC664D57cd30efDa5d3C#writeContract) on Rinkeby that allows you to sleep mint an NFT! 

On the "write contract" etherscan page, use the `7. sleepMint` function to mint an NFT to another person's wallet (specify an address and a tokenId). Then use the `2. reclaimSleepMintedNFT` to reclaim or pull that NFT back out of that person's wallet (specify the tokenId you minted). 

Here is an example [mint transaction](https://rinkeby.etherscan.io/tx/0x3a187049c3089fd67b88b4e62b3b78ea139f65e5c1684867d3b5870f115ff9d2) to another person's wallet and then a [reclaim transaction](https://rinkeby.etherscan.io/tx/0x35ac88018dac46ecf0e017137507663c21de98a06b8eb6a9cb463f219c0de14e). 


When you look at the NFT's [testnet OpenSea page](https://testnets.opensea.io/assets/0x43a87f4a18db7b342c9fec664d57cd30efda5d3c/1), and the Tokens transferred section on etherscan above, you can see how the Transfer event logs manipulate the NFT's on-chain provenance and show that `0xd2aff6...` minted and transferred the NFT even though `0xd2aff6...` was never involved with minting or transferring the NFT themselves.

## Disclaimer

_This agent code is being provided as is. No guarantee, representation or warranty is being made, express or implied, as to the safety or correctness of the agent code. The agent code has not been audited and as such there can be no assurance it will work as intended, and users may experience delays, failures, errors, omissions or loss of transmitted information. THE AGENT CODE CONTAINED HEREIN ARE FURNISHED AS IS, WHERE IS, WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTY OF MERCHANTABILITY, NON- INFRINGEMENT OR FITNESS FOR ANY PARTICULAR PURPOSE. Further, use of any of this agent code may be restricted or prohibited under applicable law, including securities laws, and it is therefore strongly advised for you to contact a reputable attorney in any jurisdiction where this agent code may be accessible for any questions or concerns with respect thereto. Further, no information provided in this repo should be construed as investment advice or legal advice for any particular facts or circumstances, and is not meant to replace competent counsel. a16z is not liable for any use of the foregoing, and users should proceed with caution and use at their own risk. See a16z.com/disclosures for more info._
