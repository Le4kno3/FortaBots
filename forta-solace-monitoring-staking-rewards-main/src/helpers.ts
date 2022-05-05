import { ethers, Finding, FindingSeverity, FindingType } from "forta-agent";
import { TestTransactionEvent } from "forta-agent-tools";
import {
  STAKING_REWARDS_SET_REWARDS_EVENT,
  STAKING_REWARDS_SET_TIMES_EVENT,
} from "./constants";

export const createLog = (abi: string, address: string, data: any) => {
  const iface = new ethers.utils.Interface([abi]);
  const fragment = Object.values(iface.events)[0];

  return {
    ...iface.encodeEventLog(fragment, data),
    address: address,
  };
};

export const createSetRewardsTx = (
  solaceStakingRewardsContractAddress: string,
  rate: number,
  sender: string,
  blockNumber: number,
  timestamp: number,
  txHash: string
) => {
  const txEvent = new TestTransactionEvent();
  const dataRaw = [rate];
  txEvent.receipt.logs.push(
    createLog(
      STAKING_REWARDS_SET_REWARDS_EVENT,
      solaceStakingRewardsContractAddress,
      dataRaw
    ) as any
  );
  txEvent.setFrom(sender);
  txEvent.setTo(solaceStakingRewardsContractAddress);
  txEvent.setBlock(blockNumber);
  txEvent.setTimestamp(timestamp);
  txEvent.setHash(txHash);
  return txEvent;
};

export const createMultipleSetRewardsTx = (
  solaceStakingRewardsContractAddress: string,
  rates: number[],
  sender: string,
  blockNumber: number,
  timestamp: number,
  txHash: string
) => {
  const txEvent = new TestTransactionEvent();
  rates.map((rate) => {
    txEvent.receipt.logs.push(
      createLog(
        STAKING_REWARDS_SET_REWARDS_EVENT,
        solaceStakingRewardsContractAddress,
        [rate]
      ) as any
    );
  });
  txEvent.setFrom(sender);
  txEvent.setTo(solaceStakingRewardsContractAddress);
  txEvent.setBlock(blockNumber);
  txEvent.setTimestamp(timestamp);
  txEvent.setHash(txHash);
  return txEvent;
};

export const createSetTimesTx = (
  solaceStakingRewardsContractAddress: string,
  startTime: number,
  endTime: number,
  sender: string,
  blockNumber: number,
  timestamp: number,
  txHash: string
) => {
  const txEvent = new TestTransactionEvent();
  const dataRaw = [startTime, endTime];
  txEvent.receipt.logs.push(
    createLog(
      STAKING_REWARDS_SET_TIMES_EVENT,
      solaceStakingRewardsContractAddress,
      dataRaw
    ) as any
  );
  txEvent.setFrom(sender);
  txEvent.setTo(solaceStakingRewardsContractAddress);
  txEvent.setBlock(blockNumber);
  txEvent.setTimestamp(timestamp);
  txEvent.setHash(txHash);
  return txEvent;
};

export const createMultipleSetTimesTx = (
  solaceStakingRewardsContractAddress: string,
  startTimes: number[],
  endTimes: number[],
  sender: string,
  blockNumber: number,
  timestamp: number,
  txHash: string
) => {
  const txEvent = new TestTransactionEvent();
  for (let i = 0; i < startTimes.length; i++) {
    txEvent.receipt.logs.push(
      createLog(
        STAKING_REWARDS_SET_TIMES_EVENT,
        solaceStakingRewardsContractAddress,
        [startTimes[i], endTimes[i]]
      ) as any
    );
  }
  txEvent.setFrom(sender);
  txEvent.setTo(solaceStakingRewardsContractAddress);
  txEvent.setBlock(blockNumber);
  txEvent.setTimestamp(timestamp);
  txEvent.setHash(txHash);
  return txEvent;
};

export const buildFindingResultSetRewards = (
  solaceStakingRewardsContractAddress: string,
  rate: number,
  sender: string,
  blockNumber: number,
  timestamp: number,
  txHash: string
) => {
  return Finding.fromObject({
    name: "Solace StakingRewards Monitoring",
    description: `StakingRewards at ${solaceStakingRewardsContractAddress}: Rewards update to ${rate} emissions per second`,
    alertId: "SOLACE-1",
    protocol: "ethereum",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    metadata: {
      txHash: txHash,
      sender,
      timestamp: timestamp.toString(),
      blockNumber: blockNumber.toString(),
    },
  });
};

export const buildFindingResultSetTimes = (
  solaceStakingRewardsContractAddress: string,
  startTime: number,
  endTime: number,
  sender: string,
  blockNumber: number,
  timestamp: number,
  txHash: string
) => {
  return Finding.fromObject({
    name: "Solace StakingRewards Monitoring",
    description: `StakingRewards at ${solaceStakingRewardsContractAddress}: Rewards times update with an start time of ${startTime} and an end time of ${endTime}`,
    alertId: "SOLACE-2",
    protocol: "ethereum",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    metadata: {
      txHash: txHash,
      sender,
      timestamp: timestamp.toString(),
      blockNumber: blockNumber.toString(),
    },
  });
};
