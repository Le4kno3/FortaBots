import Web3 from "web3";
import TimeTracker from './time.tracker';
import { getJsonRpcUrl, TransactionEvent } from "forta-agent";
import { BlockEvent, Finding, HandleBlock } from "forta-agent";
import {
  checkIsUnderWaterTrue,
  createFindingHighWater,
  createFindingIsUnderWater,
  createFindingBaseStabilityFee,
  createFindingLowWater,
  createFindingStabilityFee,
  getCollateralRatio,
  getLowWater,
  getHighWater,
  getCollateralType,
  JUG_CHANGE_BASE_FUNCTION_SIGNATURE,
  JUG_CHANGE_DUTY_FUNCTION_SIGNAUTRE,
  JUG_CONTRACT
} from "./utils";
import { provideFunctionCallsDetectorHandler } from "forta-agent-tools";
import MakerFetcher from "./maker.fetcher";

const web3: Web3 = new Web3(getJsonRpcUrl());
const tracker: TimeTracker = new TimeTracker();
const ONE_HOUR: number = 3600000; // one hour in miliseconds

export const provideMakerStrategyHandler = (
  web3: Web3,
  timeThreshold: number,
  tracker: TimeTracker
  ): HandleBlock => {
  const fetcher = new MakerFetcher(web3);

  return async (blockEvent: BlockEvent) => {
    const findings: Finding[] = [];
    const promises: any = [];

    const makers = await fetcher.getMakerStrategies(blockEvent.blockNumber);

    if (makers) {
      makers.forEach((strategy) => {
        promises.push(
          getCollateralRatio(web3, strategy, blockEvent.blockNumber).then(
            (res) => {
              return {
                strategy: strategy,
                collateralRatio: res.collateralRatio
              };
            }
          )
        );
      });

      const collaterals: any = (await Promise.all(promises)).flat();

      for (let res of collaterals) {
        const lowWater: Promise<number> = getLowWater(
          web3,
          res.strategy,
          blockEvent.blockNumber
        );

        /* Commented to stop alert.
       const highWater: Promise<number> = getHighWater(
         web3,
         res.strategy,
         blockEvent.blockNumber
       );
       const isUnderWater: Promise<boolean> = checkIsUnderWaterTrue(
         web3,
         res.strategy,
         blockEvent.blockNumber
       );
       */

        await Promise.all([lowWater]).then(
          (values) => {
            const collateralRatio = res.collateralRatio;
            const lowWater = values[0];
            /* Commented to stop alert.
            const highWater = values[1];
            const isUnderWater = values[2];
            if (isUnderWater) {
              findings.push(createFindingIsUnderWater(res.strategy.toString()));
            }
            */
            const [success, time] = tracker.tryGetLastTime(res.strategy);
            if (!success) {
              // set this block as the time to start tracking the strategy
              tracker.update(res.strategy, blockEvent.block.timestamp);
            };
            const elapsed: number = blockEvent.block.timestamp - time;
            if (elapsed >= timeThreshold && BigInt(collateralRatio) < BigInt(lowWater)) {
              tracker.update(res.strategy, blockEvent.block.timestamp);
              findings.push(
                createFindingLowWater(
                  res.strategy.toString(),
                  collateralRatio,
                  lowWater.toString()
                )
              );
            }
            /* Commented to stop alert.
            else if (BigInt(collateralRatio) > BigInt(highWater))
              findings.push(
                createFindingHighWater(
                  res.strategy.toString(),
                  collateralRatio,
                  highWater.toString()
                )
              );
              */
          }
        );
      }
    }

    return findings;
  };
};

export const provideHandleTransaction = (web3: Web3) => {
  const fetcher = new MakerFetcher(web3);

  return async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];
    const promises: any = [];

    if (!txEvent.status) return [];

    const makers = await fetcher.getMakerStrategies(txEvent.blockNumber);

    if (makers) {
      makers.forEach((strategy) => {
        promises.push(
          getCollateralType(web3, strategy, txEvent.blockNumber).then((res) => {
            return {
              strategy: strategy,
              collateralType: res
            };
          })
        );
      });

      const collaterals: any = (await Promise.all(promises)).flat();

      for (const res of collaterals) {
        const filterOnArguments = (args: { [key: string]: any }): boolean => {
          return args[1] === res.collateralType;
        };

        const agentHandler = provideFunctionCallsDetectorHandler(
          createFindingStabilityFee(res.strategy.toString()),
          JUG_CHANGE_DUTY_FUNCTION_SIGNAUTRE,
          { to: JUG_CONTRACT, filterOnArguments }
        );

        findings.push(...(await agentHandler(txEvent)));
      }
    }

    const baseChangedHandler = provideFunctionCallsDetectorHandler(
      createFindingBaseStabilityFee(),
      JUG_CHANGE_BASE_FUNCTION_SIGNATURE,
      { to: JUG_CONTRACT }
    );
    findings.push(...(await baseChangedHandler(txEvent)));

    return findings;
  };
};

export default {
  handleBlock: provideMakerStrategyHandler(web3, ONE_HOUR, tracker),
  handleTransaction: provideHandleTransaction(web3),
  provideMakerStrategyHandler,
  provideHandleTransaction
};
