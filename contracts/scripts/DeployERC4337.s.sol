// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import { EntryPoint } from "@account-abstraction/contracts/core/EntryPoint.sol";
import { SimpleAccountFactory } from "@account-abstraction/contracts/accounts/SimpleAccountFactory.sol";

contract DeployERC4337 is BaseScript {

    /**
    * Run this command to deploy ERC-4337:
    * forge script scripts/DeployERC4337.s.sol --rpc-url sepolia --broadcast
    */

    function run() external broadcast {
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();

        (string memory configJson, ) = loadConfig(network);
        (string memory implPath, string memory proxyPath, string memory abiPath) = getDeploymentPaths(stage);

        // === Deploy EntryPoint ===
        console.log("Deploying EntryPoint...");
        EntryPoint entryPoint = new EntryPoint();
        console.log("EntryPoint deployed at:", address(entryPoint));

        saveContractAddress(implPath, network, "EntryPoint", address(entryPoint));
        saveContractABI(abiPath, network, "EntryPoint");

        // === Deploy SimpleAccountFactory ===
        console.log("Deploying SimpleAccountFactory...");
        SimpleAccountFactory factory = new SimpleAccountFactory(address(entryPoint));
        console.log("SimpleAccountFactory deployed at:", address(factory));

        saveContractAddress(implPath, network, "SimpleAccountFactory", address(factory));
        saveContractABI(abiPath, network, "SimpleAccountFactory");
    }
}
