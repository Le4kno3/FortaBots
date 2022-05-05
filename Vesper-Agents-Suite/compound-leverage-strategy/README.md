# Vesper Compound Leverage Strategy

## Description

This agent detects when the current borrow ratio of Compound Leverage Strategy is too high.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- Vesper-5-1
  - Fired when the current borrow ratio is greater than max borrow ratio.
  - Severity is always set to "info".
  - Type is always set to "info".
  - The metadata contains the following fields:
    - `strategyAddress`: The address of the strategy with the high value. 
    - `currentRatio`: Current borrow ratio of the strategy.
    - `maxRatio`: Max borrow ratio of the strategy.

- Vesper-5-2
  - Fired when the current borrow ratio is to close to the collateral factor from compound.
  - Severity is always set to "info".
  - Type is always set to "info".
  - The metadata contains the following fields:
    - `strategyAddress`: The address of the strategy with the high value. 
    - `scaledBorrowRatio`: The borrow ratio of the strategy scaled as Compound does.
    - `collateralFactor`: Collateral Factor Mantissa from cToken used in strategy.
