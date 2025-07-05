// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import { EntryPoint } from "@account-abstraction/contracts/core/EntryPoint.sol";
import { SimpleAccountFactory } from "@account-abstraction/contracts/accounts/SimpleAccountFactory.sol";
import { SimpleAccount } from "@account-abstraction/contracts/accounts/SimpleAccount.sol";
import { SimplePaymaster } from "../src/SimplePaymaster.sol";

contract DeployERC4337 is BaseScript {

    /**
    * Run this command to deploy ERC-4337:
    * forge script scripts/DeployERC4337.s.sol --rpc-url sepolia --broadcast
    */

    function run() external broadcast {
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();

        (string memory implPath, , string memory abiPath) = getDeploymentPaths(stage);

        // === Deploy EntryPoint ===
        console.log("Deploying EntryPoint...");
        EntryPoint entryPoint = new EntryPoint();
        console.log("EntryPoint deployed at:", address(entryPoint));
        saveContractAddress(implPath, network, "EntryPoint", address(entryPoint));
        saveContractABI(abiPath, network, "EntryPoint");

        // === Deploy SimpleAccountFactory ===
        console.log("Deploying SimpleAccountFactory...");
        SimpleAccountFactory factory = new SimpleAccountFactory(entryPoint);
        console.log("SimpleAccountFactory deployed at:", address(factory));
        saveContractAddress(implPath, network, "SimpleAccountFactory", address(factory));
        saveContractABI(abiPath, network, "SimpleAccountFactory");

        // === Deploy Simple Paymaster ===
        console.log("Deploying SimplePaymaster...");
        SimplePaymaster paymaster = new SimplePaymaster(entryPoint);
        console.log("SimplePaymaster deployed at:", address(paymaster));

        // Fund the paymaster with ETH for gas sponsorship
        paymaster.deposit{value: 0.02 ether}();
        console.log("SimplePaymaster funded with 0.00001 ETH");

        saveContractAddress(implPath, network, "SimplePaymaster", address(paymaster));
        saveContractABI(abiPath, network, "SimplePaymaster");

        // === Generate AI Agent Smart Account ===
        // Using a deterministic address for the AI agent's EOA
        address aiAgentEOA = 0x0d7A224f923232Ea2c3B3B35f52E8000751BF1A5;

        console.log("Getting AI Agent Smart Account address...");

        // Use getAddress to get the deterministic address without deploying
        // The account will be automatically created when first used
        address aiAgentAccount = factory.getAddress(aiAgentEOA, 0);

        console.log("AI Agent Smart Account address calculated:", aiAgentAccount);

        saveContractAddress(implPath, network, "AIAgentAccount", aiAgentAccount);
        saveContractAddress(implPath, network, "AIAgentEOA", aiAgentEOA);

        console.log("\n=== ERC-4337 DEPLOYMENT COMPLETE ===");
        console.log("EntryPoint:", address(entryPoint));
        console.log("Account Factory:", address(factory));
        console.log("Simple Paymaster:", address(paymaster));
        console.log("AI Agent EOA:", aiAgentEOA);
        console.log("AI Agent Smart Account:", aiAgentAccount);
        console.log("\n=== NEXT STEPS ===");
        console.log("1. The AI agent smart account will be auto-created on first transaction");
        console.log("2. Your AI agent can now create proposals via ERC-4337");
        console.log("3. The paymaster will sponsor gas for all operations");
        console.log("4. Fund the AI agent smart account with governance tokens for voting");
        console.log("5. The smart account address is deterministic and ready to use");
    }
}