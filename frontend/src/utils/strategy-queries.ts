import { contractReadPublic } from "./contract-interactions";

// Define the formatted strategy metrics for the frontend
interface FormattedStrategyMetrics {
  apy: number;
  tvl: number;
  utilizationRate: number;
  riskAdjustedReturns: number;
  withdrawalLiquidity: number;
  description: string;
}

// Function to fetch all strategies metrics
export const getStrategiesMetrics = async (): Promise<
  FormattedStrategyMetrics[]
> => {
  const strategies = [
    "getStrategy1Metrics",
    "getStrategy2Metrics",
    "getStrategy3Metrics",
  ];

  // Strategy descriptions for each DeFi protocol
  const strategyDescriptions = [
    "Aave Protocol - Decentralized lending platform allowing your DAO to earn yield by supplying assets to liquidity pools and potentially borrowing against collateral for treasury optimization strategies.",
    "Lido Protocol - Liquid staking solution allowing your DAO to stake ETH and earn staking rewards while receiving liquid stETH tokens that can be used in other DeFi strategies and protocols.",
    "Compound Protocol - Algorithmic money market that enables your DAO to earn interest on idle treasury funds through automated lending while maintaining liquidity for governance decisions.",
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
    // Return raw numbers for display formatting
    const formatted: FormattedStrategyMetrics = {
      apy: Number(metric[0]) / 100,
      tvl: Number(metric[1]) / 1e18,
      utilizationRate: Number(metric[2]) / 100,
      riskAdjustedReturns: Number(metric[3]) / 100,
      withdrawalLiquidity: Number(metric[4]) / 100,
      description: strategyDescriptions[index],
    };

    return formatted;
  });

  console.log({ formattedStrategiesMetrics });

  return formattedStrategiesMetrics;
};
