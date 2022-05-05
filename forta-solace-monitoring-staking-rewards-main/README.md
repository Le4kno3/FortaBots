# Forta Agent to monitor StakingRewards contract of Solace protocol

## Description

This agent monitors the update of the rewards distribution of the [StakingRewards](https://docs.solace.fi/docs/dev-docs/contracts/staking/StakingRewards) contract of Solace protocol. It raises alerts when the rate or times of the rewards are updated, which can only be done by the governance.

The agent is configured for Solace protocol in Ethereum mainnet, but it is just a matter of configuration to make it work with other networks:

- Updating the `SOLACE_STAKING_REWARDS_CONTRACT_ADDRESS` parameter [here](src/config.ts) would allow us to target a different StakingRewards contract.
- Updating the `jsonRpcUrl` property of the configuration _forta_ JSON file would allow us to connect to a different network.

## Supported Chains

- Ethereum
- Any other EVM-based network where Solace is deployed

## Alerts

Describe each of the type of alerts fired by this agent

- SOLACE-1

  - Fired when the rate per second of the rewards are updated in the StakingRewards contract.
  - Severity and type are always set to `info`.
  - Additional metadata fields related to the rewards rate update:
    - `txHash`: the hash of the transaction
    - `sender`: the sender of the transaction
    - `timestamp`: the timestamp of the transaction
    - `blockNumber`: the block number of the transaction

- SOLACE-2

  - Fired when the times of the rewards are updated in the StakingRewards contract.
  - Severity and type are always set to `info`.
  - Additional metadata fields related to the rewards time update:
    - `txHash`: the hash of the transaction
    - `sender`: the sender of the transaction
    - `timestamp`: the timestamp of the transaction
    - `blockNumber`: the block number of the transaction

## Alert Samples

- The address `0x0000000000000000000000000000000000010002` submitted a transaction to update the rewards emissions per second to `100000000000`.

```JSON
{
  "name": "Solace StakingRewards Monitoring",
  "description": "StakingRewards at 0x0000000000000000000000000000000000020001: Rewards update to 100000000000 emissions per second",
  "alertId": "SOLACE-1",
  "protocol": "ethereum",
  "severity": "Info",
  "type": "Info",
  "metadata": {
    "txHash": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "sender": "0x0000000000000000000000000000000000010002",
    "timestamp": "1000000001",
    "blockNumber": "100"
  }
}
```

- The address `0x0000000000000000000000000000000000010002` submitted a transaction to update the rewards times with an start time of `1000000001` and an end time of `2000000001`.

```JSON
{
  "name": "Solace StakingRewards Monitoring",
  "description": "StakingRewards at 0x0000000000000000000000000000000000020001: Rewards times update with an start time of 1000000001 and an end time of 2000000001",
  "alertId": "SOLACE-2",
  "protocol": "ethereum",
  "severity": "Info",
  "type": "Info",
  "metadata": {
    "txHash": "0x0000000000000000000000000000000000000000000000000000000000000001",
    "sender": "0x0000000000000000000000000000000000010002",
    "timestamp": "1000000001",
    "blockNumber": "100"
  }
}
```

## Try it out youself

- `npm run tx 0xa117319020d0f7e80e674463725071d5027c23c4a4edb1928ff7d2e1f8912027`, in Ethereum mainnet will trigger the following alert:

```
1 findings for transaction 0xa117319020d0f7e80e674463725071d5027c23c4a4edb1928ff7d2e1f8912027 {
  "name": "Solace StakingRewards Monitoring",
  "description": "StakingRewards at 0x501ace3D42f9c8723B108D4fBE29989060a91411: Rewards times update with an start time of 1642701600 and an end time of 115792089237316195423570985008687907853269984665640564039457584007913129639935",
  "alertId": "SOLACE-2",
  "protocol": "ethereum",
  "severity": "Info",
  "type": "Info",
  "metadata": {
    "txHash": "0xa117319020d0f7e80e674463725071d5027c23c4a4edb1928ff7d2e1f8912027",
    "sender": "0x501ace0e8d16b92236763e2ded7ae3bc2dffa276",
    "timestamp": "1642614269",
    "blockNumber": "14037386"
  }
}
```
