# High Gas Agent

## Description

This agent detects transactions with high gas used and high gas fee. Requires API key for CoinMarketCap API in crypto.price.getter.js to fetch ETH price

## Supported Chains

- Ethereum

## Alerts

- FORTA-1
  - Fired when a transaction uses more than 1000000 gas
  - Severity is always set to "medium" if gas above 1000000, "high" if above 3000000, "critical" if above 7000000
  - Type is always set to "suspicious"
  - Metadata "gasUsed" field contains amount of gas used
- FORTA-2
  - Fired when a transaction has gas fee of more than $100 USD
  - Severity is always set to "medium" if fee above $100, "high" if above $500, "critical" if above $1000
  - Type is always set to "suspicious"
  - Metadata "fee" field contains USD amount of fee

## Test Data

The agent behaviour can be verified with the following transactions:

- 0xd42c2a97d14d1faaf9037445bd5b0d117e9d077455ec188a9cca89239cbcc59e (gas used 1417648)
- 0x30e07979f663aa50823c6d6d760cf0eb8caba1c0ef92aa0e26173a0419faac34 (gas fee $514.14 and gas used 1088194)
