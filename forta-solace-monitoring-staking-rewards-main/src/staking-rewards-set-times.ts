import {
  Finding,
  FindingSeverity,
  FindingType,
  TransactionEvent,
} from "forta-agent";
import { STAKING_REWARDS_SET_TIMES_EVENT } from "./constants";

async function handleTransaction(
  txEvent: TransactionEvent,
  config: {
    solaceStakingRewardsContractAddress: string;
  }
) {
  const findings: Finding[] = [];

  // if no events found for reward times update, return
  const setTimesEvents = txEvent.filterLog(
    STAKING_REWARDS_SET_TIMES_EVENT,
    config.solaceStakingRewardsContractAddress
  );
  if (!setTimesEvents.length) return findings;

  for (const setTimesEvent of setTimesEvents) {
    findings.push(
      Finding.fromObject({
        name: "Solace StakingRewards Monitoring",
        description: `StakingRewards at ${config.solaceStakingRewardsContractAddress}: Rewards times update with an start time of ${setTimesEvent.args.startTime} and an end time of ${setTimesEvent.args.endTime}`,
        alertId: "SOLACE-2",
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
