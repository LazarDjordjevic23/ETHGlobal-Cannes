// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BaseScript.s.sol";
import {DAOToken} from "../src/DAOToken.sol";

contract MintAndDelegate is BaseScript {

    /**
     * Run this command to mint DAO tokens and delegate voting power:
     * forge script scripts/MintAndDelegate.s.sol --rpc-url sepolia --broadcast
     */

    function run() external broadcast {
        // Step 1: Get network and stage info
        string memory network = getNetworkName();
        console.log("Minting DAO tokens and delegating power on network:", network);

        string memory stage = getDeploymentStage();
        (string memory addressesPath,,) = getDeploymentPaths(stage);

        // Step 2: Load DAO Token contract address
        string memory addressJson = loadAddressFile(addressesPath);
        address daoTokenAddress = getContractAddress(addressJson, network, "DAOToken");
        require(daoTokenAddress != address(0), "MintAndDelegate: DAOToken address not found");

        console.log("Found DAOToken at:", daoTokenAddress);

        // Step 3: Create DAOToken instance
        DAOToken daoToken = DAOToken(daoTokenAddress);

        // Step 4: Configuration - amount to mint and delegate address
        uint256 mintAmount = 1000 * 1e18; // 1000 tokens
        address delegateAddress = _broadcaster; // Default: delegate to self

        // You can change this to delegate to a different address if needed
        // address delegateAddress = 0x65CF522114b232cf5f9172F170d82Bc83676F1d6; // Example: delegate to someone else

        console.log("Minting", mintAmount / 1e18, "tokens to:", _broadcaster);
        console.log("Will delegate voting power to:", delegateAddress);

        // Step 5: Check current state
        uint256 balanceBefore = daoToken.balanceOf(_broadcaster);
        uint256 votingPowerBefore = daoToken.getVotes(_broadcaster);
        uint256 totalSupplyBefore = daoToken.totalSupply();

        console.log("\n=== BEFORE MINTING ===");
        console.log("Current balance:", balanceBefore / 1e18, "tokens");
        console.log("Current voting power:", votingPowerBefore / 1e18, "votes");
        console.log("Total supply:", totalSupplyBefore / 1e18, "tokens");

        // Step 6: Mint tokens to msg.sender (_broadcaster)
        daoToken.mint(_broadcaster, mintAmount);
        console.log("\nMinted", mintAmount / 1e18, "tokens successfully!");

        // Step 7: Delegate voting power
        daoToken.delegate(delegateAddress);
        console.log("Delegated voting power to:", delegateAddress);

        // Step 8: Verify the results
        uint256 balanceAfter = daoToken.balanceOf(_broadcaster);
        uint256 votingPowerAfter = daoToken.getVotes(delegateAddress);
        uint256 totalSupplyAfter = daoToken.totalSupply();

        console.log("\n=== AFTER MINTING & DELEGATING ===");
        console.log("New balance:", balanceAfter / 1e18, "tokens");
        console.log("New voting power for delegate:", votingPowerAfter / 1e18, "votes");
        console.log("New total supply:", totalSupplyAfter / 1e18, "tokens");

        // Step 9: Summary
        console.log("\n=== SUMMARY ===");
        console.log("Tokens minted:", (balanceAfter - balanceBefore) / 1e18);
        console.log("Voting power gained:", (votingPowerAfter - votingPowerBefore) / 1e18);
        console.log("Total supply increased by:", (totalSupplyAfter - totalSupplyBefore) / 1e18);

        if (delegateAddress == _broadcaster) {
            console.log("Successfully delegated voting power to self");
        } else {
            console.log("Successfully delegated voting power to external address");
        }

        console.log("\n=== NEXT STEPS ===");
        console.log("1. You now have more DAO tokens and voting power");
        console.log("2. You can participate in governance proposals");
        console.log("3. You can create proposals if you meet the threshold");
        console.log("4. Use your voting power to vote on active proposals");
    }
}