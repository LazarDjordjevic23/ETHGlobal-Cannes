// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {Treasury} from "../src/Treasury.sol";
import {ETHToken} from "../src/ETHToken.sol";
import {Strategy} from "../src/Strategy.sol";
import {Governance} from "../src/Governance.sol";

contract FetchDAOState is BaseScript {

    /**
     * Run this command to fetch DAO state:
     * forge script scripts/FetchDAOState.s.sol --rpc-url sepolia
     */

    function run() external {
        // Step 1: Get network and stage info
        string memory network = getNetworkName();
        console.log("=== Fetching DAO State for network:", network, "===");

        string memory stage = getDeploymentStage();
        (string memory addressesPath,,) = getDeploymentPaths(stage);

        // Step 2: Load contract addresses
        string memory addressJson = loadAddressFile(addressesPath);

        address daoTokenAddress = getContractAddress(addressJson, network, "DAOToken");
        address payable treasuryAddress = payable(getContractAddress(addressJson, network, "Treasury"));
        address ethTokenAddress = getContractAddress(addressJson, network, "ETHToken");
        address strategyAddress = getContractAddress(addressJson, network, "Strategy");
        address payable governanceAddress = payable(getContractAddress(addressJson, network, "Governance"));

        require(daoTokenAddress != address(0), "DAOToken address not found");
        require(treasuryAddress != address(0), "Treasury address not found");
        require(ethTokenAddress != address(0), "ETHToken address not found");
        require(strategyAddress != address(0), "Strategy address not found");
        require(governanceAddress != address(0), "Governance address not found");

        // Step 3: Create contract instances
        DAOToken daoToken = DAOToken(daoTokenAddress);
        Treasury treasury = Treasury(treasuryAddress);
        ETHToken ethToken = ETHToken(ethTokenAddress);
        Strategy strategy = Strategy(strategyAddress);
        Governance governance = Governance(governanceAddress);

        console.log("\n=== CONTRACT ADDRESSES ===");
        console.log("DAOToken:", daoTokenAddress);
        console.log("Treasury:", treasuryAddress);
        console.log("ETHToken:", ethTokenAddress);
        console.log("Strategy:", strategyAddress);
        console.log("Governance:", governanceAddress);

        // Step 4: Fetch DAO Token metrics and holders
        console.log("\n=== DAO TOKEN METRICS ===");
        console.log("Name:", daoToken.name());
        console.log("Symbol:", daoToken.symbol());
        console.log("Total Supply:", daoToken.totalSupply() / 1e18, "tokens");
        console.log("Decimals:", daoToken.decimals());

        // Known holders (from deployment script)
        address[] memory holders = new address[](2);
        holders[0] = 0x65CF522114b232cf5f9172F170d82Bc83676F1d6;
        holders[1] = 0xd5D03F2d454fF295E24DcB9035E233b57087B641;

        console.log("\n=== DAO TOKEN HOLDERS & VOTING POWER ===");
        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 balance = daoToken.balanceOf(holder);
            uint256 votingPower = daoToken.getVotes(holder);

            console.log("Holder:", holder);
            console.log("  Balance:", balance / 1e18, "tokens");
            console.log("  Voting Power:", votingPower / 1e18, "votes");
        }

        // Step 5: Fetch Treasury metrics
        console.log("\n=== TREASURY METRICS ===");
        console.log("Owner (Governance):", treasury.getGovernance());
        console.log("ETH Balance:", treasury.getEtherBalance() / 1e18, "ETH");
        console.log("ETHToken Balance:", treasury.getTokenBalance(ethTokenAddress) / 1e18, "ETHTokens");

        // Step 6: Fetch ETH Token metrics
        console.log("\n=== ETH TOKEN METRICS ===");
        console.log("Name:", ethToken.name());
        console.log("Symbol:", ethToken.symbol());
        console.log("Total Supply:", ethToken.totalSupply() / 1e18, "tokens");
        console.log("Decimals:", ethToken.decimals());

        console.log("\n=== ETH TOKEN BALANCES ===");
        console.log("Treasury Balance:", ethToken.balanceOf(treasuryAddress) / 1e18, "ETHTokens");
        console.log("Strategy Balance:", ethToken.balanceOf(strategyAddress) / 1e18, "ETHTokens");

        // Check holder balances
        for (uint256 i = 0; i < holders.length; i++) {
            address holder = holders[i];
            uint256 balance = ethToken.balanceOf(holder);
            console.log("Holder:");
            console.log("  Address:", holder);
            console.log("  Balance:", balance / 1e18, "ETHTokens");
        }

        // Step 7: Fetch Strategy information
        console.log("\n=== STRATEGY METRICS ===");
        console.log("Strategy ETHToken Balance:", strategy.getTokenBalance(ethTokenAddress) / 1e18, "ETHTokens");

        // Strategy 1
        console.log("\n--- Strategy 1 ---");
        (uint256 apy1, uint256 tvl1, uint256 util1, uint256 risk1, uint256 liq1) = strategy.getStrategy1Metrics();
        console.log("APY %:", apy1 / 100);
        console.log("TVL:", tvl1 / 1e18);
        console.log("Utilization Rate %:", util1 / 100);
        console.log("Risk-Adjusted Returns (Sharpe) %:", risk1 / 100);
        console.log("Withdrawal Liquidity %:", liq1 / 100);

        // Strategy 2
        console.log("\n--- Strategy 2 ---");
        (uint256 apy2, uint256 tvl2, uint256 util2, uint256 risk2, uint256 liq2) = strategy.getStrategy2Metrics();
        console.log("APY %:", apy2 / 100);
        console.log("TVL:", tvl2 / 1e18);
        console.log("Utilization Rate %:", util2 / 100);
        console.log("Risk-Adjusted Returns (Sharpe) %:", risk2 / 100);
        console.log("Withdrawal Liquidity %:", liq2 / 100);

        // Strategy 3
        console.log("\n--- Strategy 3 ---");
        (uint256 apy3, uint256 tvl3, uint256 util3, uint256 risk3, uint256 liq3) = strategy.getStrategy3Metrics();
        console.log("APY %:", apy3 / 100);
        console.log("TVL:", tvl3 / 1e18);
        console.log("Utilization Rate %:", util3 / 100);
        console.log("Risk-Adjusted Returns (Sharpe) %:", risk3 / 100);
        console.log("Withdrawal Liquidity %:", liq3 / 100);

        // Step 8: Fetch Governance metrics
        console.log("\n=== GOVERNANCE METRICS ===");
        console.log("Voting Delay:", governance.votingDelay(), "seconds");
        console.log("Voting Period:", governance.votingPeriod(), "seconds");
        console.log("Proposal Threshold:", governance.proposalThreshold() / 1e18, "tokens");
        console.log("Quorum (at current block):", governance.quorum(block.number) / 1e18, "tokens");

        console.log("\n=== DAO STATE FETCH COMPLETED ===");
    }
}