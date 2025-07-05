import { contractReadPublic } from "./contract-interactions";

export interface FormattedStrategyMetrics {
  apy: number;
  tvl: number;
  utilizationRate: number;
  riskAdjustedReturns: number;
  withdrawalLiquidity: number;
  description: string;
  link: string;
}

export const getStrategiesMetrics = async (): Promise<
  FormattedStrategyMetrics[]
> => {
  const strategies = [
    "getStrategy1Metrics",
    "getStrategy2Metrics",
    "getStrategy3Metrics",
  ];

  const strategyDescriptions = [
    "Aave Protocol - Decentralized lending platform allowing your DAO to earn yield by supplying assets to liquidity pools and potentially borrowing against collateral for treasury optimization strategies.",
    "Lido Protocol - Liquid staking solution allowing your DAO to stake ETH and earn staking rewards while receiving liquid stETH tokens that can be used in other DeFi strategies and protocols.",
    "Compound Protocol - Algorithmic money market that enables your DAO to earn interest on idle treasury funds through automated lending while maintaining liquidity for governance decisions.",
  ];

  const linksToStrategies = [
    "https://aave.com",
    "https://lido.fi",
    "https://compound.finance",
  ];

  const strategiesMetrics = await Promise.all(
    strategies.map(
      (strategy) =>
        contractReadPublic({
          contractName: "Strategy",
          functionName: strategy,
        }) as unknown as string[]
    )
  );

  const formattedStrategiesMetrics = strategiesMetrics.map((metric, index) => {
    const formatted: FormattedStrategyMetrics = {
      apy: Number(metric[0]) / 100,
      tvl: Number(metric[1]) / 1e18,
      utilizationRate: Number(metric[2]) / 100,
      riskAdjustedReturns: Number(metric[3]) / 100,
      withdrawalLiquidity: Number(metric[4]) / 100,
      description: strategyDescriptions[index],
      link: linksToStrategies[index],
    };

    return formatted;
  });

  console.log({ formattedStrategiesMetrics });

  return formattedStrategiesMetrics;
};
