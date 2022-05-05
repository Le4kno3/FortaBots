import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { SOLACE_STAKING_REWARDS_CONTRACT_ADDRESS } from "./config";

import stakingRewardsSetRewards from "./staking-rewards-set-rewards";
import stakingRewardsSetTimes from "./staking-rewards-set-times";

export type Config = {
  solaceStakingRewardsContractAddress: string;
};

export type StakingRewardsSetRewardsHandleTransactionFunctionType = (
  txEvent: TransactionEvent,
  config: Config
) => Promise<Finding[]>;

export type StakingRewardsSetTimesHandleTransactionFunctionType = (
  txEvent: TransactionEvent,
  config: Config
) => Promise<Finding[]>;

function provideHandleTransaction(
  stakingRewardsSetRewardsHandleTransaction: StakingRewardsSetRewardsHandleTransactionFunctionType,
  stakingRewardsSetTimesHandleTransaction: StakingRewardsSetTimesHandleTransactionFunctionType,
  config: Config
): HandleTransaction {
  return async function handleTransaction(txEvent: TransactionEvent) {
    const findingsSetRewards = await stakingRewardsSetRewardsHandleTransaction(
      txEvent,
      config
    );

    const findingsSetTimes = await stakingRewardsSetTimesHandleTransaction(
      txEvent,
      config
    );

    return [findingsSetRewards, findingsSetTimes].flat();
  };
}

export default {
  provideHandleTransaction,
  handleTransaction: provideHandleTransaction(
    stakingRewardsSetRewards.handleTransaction,
    stakingRewardsSetTimes.handleTransaction,
    {
      solaceStakingRewardsContractAddress:
        SOLACE_STAKING_REWARDS_CONTRACT_ADDRESS,
    }
  ),
};
