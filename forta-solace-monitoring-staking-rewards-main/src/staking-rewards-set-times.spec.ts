import { createAddress, TestTransactionEvent } from "forta-agent-tools";
import {
  buildFindingResultSetTimes,
  createSetTimesTx,
  createMultipleSetTimesTx,
} from "./helpers";

import stakingRewardsSetTimesAgent from "./staking-rewards-set-times";

describe("staking rewards times update", () => {
  let handleTransaction: any;

  const mockConfig = {
    solaceStakingRewardsContractAddress: createAddress("0x1"),
  };

  const senders = [
    createAddress("0x20001"),
    createAddress("0x20002"),
    createAddress("0x20003"),
    createAddress("0x20004"),
  ];

  beforeAll(() => {
    handleTransaction = stakingRewardsSetTimesAgent.handleTransaction;
  });

  it("returns 0 findings since there are no rewards times update events", async () => {
    const basicTxEvent = new TestTransactionEvent();

    const findings = await handleTransaction(basicTxEvent, mockConfig);

    expect(findings).toStrictEqual([]);
  });

  it("returns 1 finding since rewards times were updated", async () => {
    const txEvent = createSetTimesTx(
      mockConfig.solaceStakingRewardsContractAddress,
      10000,
      20000,
      senders[0],
      1,
      2,
      "0xHash"
    );

    const findings = await handleTransaction(txEvent, mockConfig);

    const expectedFinding = buildFindingResultSetTimes(
      mockConfig.solaceStakingRewardsContractAddress,
      10000,
      20000,
      senders[0],
      1,
      2,
      "0xHash"
    );

    expect(findings).toStrictEqual([expectedFinding]);
  });

  it("returns 2 findings since rewards times were updated twice in the same transaction", async () => {
    const txEvent = createMultipleSetTimesTx(
      mockConfig.solaceStakingRewardsContractAddress,
      [10000, 1000000002],
      [20000, 2000000002],
      senders[0],
      1,
      2,
      "0xHash"
    );

    const findings = await handleTransaction(txEvent, mockConfig);

    const expectedFindings = [
      buildFindingResultSetTimes(
        mockConfig.solaceStakingRewardsContractAddress,
        10000,
        20000,
        senders[0],
        1,
        2,
        "0xHash"
      ),
      buildFindingResultSetTimes(
        mockConfig.solaceStakingRewardsContractAddress,
        1000000002,
        2000000002,
        senders[0],
        1,
        2,
        "0xHash"
      ),
    ];

    expect(findings).toStrictEqual(expectedFindings);
  });
});
