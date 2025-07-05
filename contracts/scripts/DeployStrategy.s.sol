// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BaseScript.s.sol";
import {Strategy} from "../src/Strategy.sol";

contract DeployStrategy is BaseScript {

    /**
     * Run this command to deploy the Strategy:
     * forge script scripts/DeployStrategy.s.sol --rpc-url sepolia --broadcast
     */

    function run() external broadcast {
        // Step 1: Get network and stage info
        string memory network = getNetworkName();
        console.log("Deploying Strategy to network:", network);

        string memory stage = getDeploymentStage();
        console.log("Using deployment stage:", stage);

        // Step 2: Get file paths for saving addresses and ABIs
        (
        string memory addressesPath,
        ,  // We don't need proxy addresses for Strategy
        string memory abiPath
        ) = getDeploymentPaths(stage);

        // Step 3: Deploy Strategy contract
        console.log("Deploying Strategy contract...");
        Strategy strategy = new Strategy();

        console.log("Strategy deployed at:", address(strategy));

        // Step 4: Save contract address and ABI
        saveContractAddress(addressesPath, network, "Strategy", address(strategy));
        saveContractABI(abiPath, network, "Strategy");

        console.log("Strategy deployment completed successfully!");

        // Step 5: Verify deployment by checking metrics
        console.log("=== Deployment Verification ===");
        console.log("Strategy address:", address(strategy));

        // Test Strategy 1 metrics
        (uint256 apy1, uint256 tvl1, uint256 util1, uint256 risk1, uint256 liq1, string memory desc1) = strategy.getStrategy1Metrics();
        console.log("Strategy 1 - APY:", apy1);
        console.log("Strategy 1 - TVL:", tvl1 / 1e18);
        console.log("Strategy 1 - Utilization:", util1);
        console.log("Strategy 1 - Sharpe Ratio:", risk1);
        console.log("Strategy 1 - Withdrawal Liquidity:", liq1);
        console.log("Strategy 1 - Description:", desc1);

        // Test Strategy 2 metrics
        (uint256 apy2, uint256 tvl2, uint256 util2, uint256 risk2, uint256 liq2, string memory desc2) = strategy.getStrategy2Metrics();
        console.log("Strategy 2 - APY:", apy2);
        console.log("Strategy 2 - TVL:", tvl2 / 1e18);
        console.log("Strategy 2 - Utilization:", util2);
        console.log("Strategy 2 - Sharpe Ratio:", risk2);
        console.log("Strategy 2 - Withdrawal Liquidity:", liq2);
        console.log("Strategy 2 - Description:", desc2);

        // Test Strategy 3 metrics
        (uint256 apy3, uint256 tvl3, uint256 util3, uint256 risk3, uint256 liq3, string memory desc3) = strategy.getStrategy3Metrics();
        console.log("Strategy 3 - APY:", apy3);
        console.log("Strategy 3 - TVL:", tvl3 / 1e18);
        console.log("Strategy 3 - Utilization:", util3);
        console.log("Strategy 3 - Sharpe Ratio:", risk3);
        console.log("Strategy 3 - Withdrawal Liquidity:", liq3);
        console.log("Strategy 3 - Description:", desc3);

        // Log next steps
        console.log("=== Next Steps ===");
        console.log("1. Strategy contract deployed with 3 fake strategies");
        console.log("2. Each strategy has getMetrics() and execute() functions");
        console.log("3. Ready to be used with Treasury for governance proposals");
        console.log("4. Strategies can receive and hold ERC20 tokens");
    }
}