import { createAddress, TestTransactionEvent } from "forta-agent-tools";
import {
  buildFindingResultSetRewards,
  createSetRewardsTx,
  createMultipleSetRewardsTx,
} from "./helpers";

import stakingRewardsSetRewardsAgent from "./staking-rewards-set-rewards";

describe("staking rewards rewards update", () => {
  let handleTransaction: any;

  const mockConfig = {
    solaceStakingRewardsContractAddress: createAddress("0x1"),
  };

  const rates = [1, 2, 3, 4];
  const senders = [
    createAddress("0x20001"),
    createAddress("0x20002"),
    createAddress("0x20003"),
    createAddress("0x20004"),
  ];

  beforeAll(() => {
    handleTransaction = stakingRewardsSetRewardsAgent.handleTransaction;
  });

  it("returns 0 findings since there are no rewards update events", async () => {
    const basicTxEvent = new TestTransactionEvent();

    const findings = await handleTransaction(basicTxEvent, mockConfig);

    expect(findings).toStrictEqual([]);
  });

  it("returns 1 finding since rewards were updated", async () => {
    const txEvent = createSetRewardsTx(
      mockConfig.solaceStakingRewardsContractAddress,
      rates[0],
      senders[0],
      1,
      2,
      "0xHash"
    );

    const findings = await handleTransaction(txEvent, mockConfig);

    const expectedFinding = buildFindingResultSetRewards(
      mockConfig.solaceStakingRewardsContractAddress,
      rates[0],
      senders[0],
      1,
      2,
      "0xHash"
    );

    expect(findings).toStrictEqual([expectedFinding]);
  });

  it("returns 2 findings since rewards were updated twice in the same transaction", async () => {
    const txEvent = createMultipleSetRewardsTx(
      mockConfig.solaceStakingRewardsContractAddress,
      [rates[0], rates[1]],
      senders[0],
      1,
      2,
      "0xHash"
    );

    const findings = await handleTransaction(txEvent, mockConfig);

    const expectedFindings = [
      buildFindingResultSetRewards(
        mockConfig.solaceStakingRewardsContractAddress,
        rates[0],
        senders[0],
        1,
        2,
        "0xHash"
      ),
      buildFindingResultSetRewards(
        mockConfig.solaceStakingRewardsContractAddress,
        rates[1],
        senders[0],
        1,
        2,
        "0xHash"
      ),
    ];

    expect(findings).toStrictEqual(expectedFindings);
  });
});
