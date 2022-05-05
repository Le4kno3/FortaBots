import agent from "./agent";

describe("Solace StakingRewards Monitoring Agent", () => {
  let handleTransaction: any;

  const mockStakingRewardsSetRewards = {
    handleTransaction: jest.fn(),
  };
  const mockStakingRewardsSetTimes = {
    handleTransaction: jest.fn(),
  };
  const mockTxEvent = {
    some: "event",
  };

  const mockConfig = {
    solaceStakingRewardsContractAddress: "0x",
  };

  beforeAll(() => {
    handleTransaction = agent.provideHandleTransaction(
      mockStakingRewardsSetRewards.handleTransaction,
      mockStakingRewardsSetTimes.handleTransaction,
      mockConfig
    );
  });

  it("calls stakingRewardsSetRewards and stakingRewardsSetTimes and returns its findings", async () => {
    const mockFinding1 = { some: "finding1" };
    const mockFinding2 = { some: "finding2" };
    mockStakingRewardsSetRewards.handleTransaction.mockReturnValueOnce([
      mockFinding1,
    ]);
    mockStakingRewardsSetTimes.handleTransaction.mockReturnValueOnce([
      mockFinding2,
    ]);

    const findings = await handleTransaction(mockTxEvent);

    expect(findings).toStrictEqual([mockFinding1, mockFinding2]);
    expect(
      mockStakingRewardsSetRewards.handleTransaction
    ).toHaveBeenCalledTimes(1);
    expect(mockStakingRewardsSetRewards.handleTransaction).toHaveBeenCalledWith(
      mockTxEvent,
      mockConfig
    );
    expect(mockStakingRewardsSetTimes.handleTransaction).toHaveBeenCalledTimes(
      1
    );
    expect(mockStakingRewardsSetTimes.handleTransaction).toHaveBeenCalledWith(
      mockTxEvent,
      mockConfig
    );
  });
});
