// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {ETHToken} from "../src/ETHToken.sol";

contract MintETHTokens is BaseScript {

    /**
     * Run this command to mint ETH tokens to a given address:
     * forge script scripts/MintETHTokens.s.sol --rpc-url sepolia --broadcast
     */

    function run() external broadcast {
        // Step 1: Get network and stage info
        string memory network = getNetworkName();
        console.log("Minting ETH tokens on network:", network);

        string memory stage = getDeploymentStage();
        (string memory addressesPath,,) = getDeploymentPaths(stage);

        // Step 2: Load ETH Token contract address
        string memory addressJson = loadAddressFile(addressesPath);
        address ethTokenAddress = getContractAddress(addressJson, network, "ETHToken");
        require(ethTokenAddress != address(0), "MintETHTokens: ETHToken address not found");

        console.log("Found ETHToken at:", ethTokenAddress);

        // Step 3: Create ETHToken instance
        ETHToken ethToken = ETHToken(ethTokenAddress);

        // Step 4: Configuration - amount to mint and recipient address
        uint256 mintAmount = 5000 * 1e18; // 5000 ETH tokens
        address recipient = _broadcaster; // Default: mint to script broadcaster

        // You can change this to mint to a different address if needed
        // address recipient = 0x65CF522114b232cf5f9172F170d82Bc83676F1d6; // Example: mint to specific address
        // address recipient = 0xd5D03F2d454fF295E24DcB9035E233b57087B641; // Example: mint to another address

        console.log("Minting", mintAmount / 1e18, "ETH tokens to:", recipient);

        // Step 5: Check current state
        uint256 balanceBefore = ethToken.balanceOf(recipient);
        uint256 totalSupplyBefore = ethToken.totalSupply();

        console.log("\n=== BEFORE MINTING ===");
        console.log("Current balance:", balanceBefore / 1e18, "ETH tokens");
        console.log("Total supply:", totalSupplyBefore / 1e18, "ETH tokens");

        // Step 6: Mint ETH tokens to recipient
        ethToken.mint(recipient, mintAmount);
        console.log("\nMinted", mintAmount / 1e18, "ETH tokens successfully!");

        // Step 7: Verify the results
        uint256 balanceAfter = ethToken.balanceOf(recipient);
        uint256 totalSupplyAfter = ethToken.totalSupply();

        console.log("\n=== AFTER MINTING ===");
        console.log("New balance:", balanceAfter / 1e18, "ETH tokens");
        console.log("New total supply:", totalSupplyAfter / 1e18, "ETH tokens");

        // Step 8: Summary
        console.log("\n=== SUMMARY ===");
        console.log("Recipient address:", recipient);
        console.log("ETH tokens minted:", (balanceAfter - balanceBefore) / 1e18);
        console.log("Total supply increased by:", (totalSupplyAfter - totalSupplyBefore) / 1e18);
        console.log("Minting operation completed successfully!");

        console.log("\n=== ETH TOKEN INFO ===");
        console.log("Token name:", ethToken.name());
        console.log("Token symbol:", ethToken.symbol());
        console.log("Token decimals:", ethToken.decimals());

        console.log("\n=== NEXT STEPS ===");
        console.log("1. ETH tokens have been minted to the specified address");
        console.log("2. These tokens can be used with the Strategy contract");
        console.log("3. Tokens can be deposited into Treasury");
        console.log("4. Use these tokens for strategy execution or governance proposals");
    }
}