import {
  Finding,
  FindingSeverity,
  FindingType,
  TransactionEvent,
} from "forta-agent";
import { STAKING_REWARDS_SET_REWARDS_EVENT } from "./constants";

async function handleTransaction(
  txEvent: TransactionEvent,
  config: {
    solaceStakingRewardsContractAddress: string;
  }
) {
  const findings: Finding[] = [];

  // if no events found for rewards updates, return
  const setRewardsEvents = txEvent.filterLog(
    STAKING_REWARDS_SET_REWARDS_EVENT,
    config.solaceStakingRewardsContractAddress
  );
  if (!setRewardsEvents.length) return findings;

  for (const setRewardsEvent of setRewardsEvents) {
    findings.push(
      Finding.fromObject({
        name: "Solace StakingRewards Monitoring",
        description: `StakingRewards at ${config.solaceStakingRewardsContractAddress}: Rewards update to ${setRewardsEvent.args.rewardPerSecond} emissions per second`,
        alertId: "SOLACE-1",
        protocol: "ethereum",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        metadata: {
          txHash: txEvent.hash,
          sender: txEvent.from,
          timestamp: txEvent.timestamp.toString(),
          blockNumber: txEvent.blockNumber.toString(),
        },
      })
    );
  }

  return findings;
}

export default {
  handleTransaction,
};
