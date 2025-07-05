// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {Treasury} from "../src/Treasury.sol";
import {ETHToken} from "../src/ETHToken.sol";

contract DeployTreasury is BaseScript {

    /**
     * Run this command to deploy the Treasury and ETHToken:
     * forge script scripts/DeployTreasury.s.sol --rpc-url sepolia --broadcast
     */

    function run() external broadcast {
        // Step 1: Get network and stage info
        string memory network = getNetworkName();
        console.log("Deploying Treasury and ETHToken to network:", network);

        string memory stage = getDeploymentStage();
        console.log("Using deployment stage:", stage);

        // Step 2: Get file paths for saving addresses and ABIs
        (
        string memory addressesPath,
        ,  // We don't need proxy addresses for Treasury
        string memory abiPath
        ) = getDeploymentPaths(stage);

        // Step 3: Load JSON files with contract addresses
        string memory addressJson = loadAddressFile(addressesPath);

        // Step 4: Get the Governance contract address
        address governanceAddress = getContractAddress(addressJson, network, "Governance");
        require(governanceAddress != address(0), "DeployTreasury: Governance address not found");

        console.log("Found Governance contract at:", governanceAddress);

        // Step 5: Deploy ETHToken contract
        console.log("Deploying ETHToken...");
        ETHToken ethToken = new ETHToken(_broadcaster);

        console.log("ETHToken deployed at:", address(ethToken));

        // Step 6: Deploy Treasury contract
        console.log("Deploying Treasury with Governance as owner...");
        Treasury treasury = new Treasury(governanceAddress);

        console.log("Treasury deployed at:", address(treasury));
        console.log("Treasury owner (governance):", treasury.owner());

        // Step 7: Mint 100,000 ETHTokens to Treasury
        uint256 mintAmount = 100000 * 1e18; // 100,000 tokens with 18 decimals
        console.log("Minting 100,000 ETHTokens to Treasury...");
        ethToken.mint(address(treasury), mintAmount);

        console.log("Minted", mintAmount / 1e18, "ETHTokens to Treasury");

        // Step 8: Save contract addresses and ABIs
        saveContractAddress(addressesPath, network, "Treasury", address(treasury));
        saveContractABI(abiPath, network, "Treasury");

        saveContractAddress(addressesPath, network, "ETHToken", address(ethToken));
        saveContractABI(abiPath, network, "ETHToken");

        console.log("Treasury and ETHToken deployment completed successfully!");

        // Step 9: Verify deployment
        console.log("=== Deployment Verification ===");
        console.log("Treasury address:", address(treasury));
        console.log("Treasury governance:", treasury.getGovernance());
        console.log("Treasury ETH balance:", treasury.getEtherBalance());
        console.log("ETHToken address:", address(ethToken));
        console.log("ETHToken total supply:", ethToken.totalSupply() / 1e18);
        console.log("Treasury ETHToken balance:", treasury.getTokenBalance(address(ethToken)) / 1e18);

        // Log next steps
        console.log("=== Next Steps ===");
        console.log("1. The Treasury is now owned by the Governance contract");
        console.log("2. Treasury has 100,000 ETHTokens ready for governance proposals");
        console.log("3. Only governance proposals can withdraw funds from the Treasury");
        console.log("4. Anyone can deposit ETH or tokens to the Treasury");
        console.log("5. Use governance proposals to manage Treasury funds");
    }
}