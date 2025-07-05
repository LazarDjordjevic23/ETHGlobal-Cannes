// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {Governance} from "../src/Governance.sol";

contract CreateStrategyProposal is BaseScript {

    /**
     * Run this command to create a DAO proposal for Strategy 1 execution:
     * forge script scripts/CreateStrategyProposal.s.sol --rpc-url sepolia --broadcast
     */

    uint256 constant STRATEGY_DEPOSIT_AMOUNT = 1 * 1e18;

    function run() external broadcast {
        // Get network and load addresses
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();
        (string memory addressesPath,,) = getDeploymentPaths(stage);
        string memory addressJson = loadAddressFile(addressesPath);

        // Get contract addresses
        address governanceAddress = getContractAddress(addressJson, network, "Governance");
        address treasuryAddress = getContractAddress(addressJson, network, "Treasury");
        address strategyAddress = getContractAddress(addressJson, network, "Strategy");
        address ethTokenAddress = getContractAddress(addressJson, network, "ETHToken");

        console.log("Creating proposal on network:", network);
        console.log("Governance:", governanceAddress);
        console.log("Treasury:", treasuryAddress);
        console.log("Strategy:", strategyAddress);
        console.log("ETHToken:", ethTokenAddress);

        // Initialize governance contract
        Governance governance = Governance(payable(governanceAddress));

        // Encode Strategy.executeStrategy1(token, amount)
        bytes memory strategyCalldata = abi.encodeWithSignature(
            "executeStrategy1(address,uint256)",
            ethTokenAddress,
            STRATEGY_DEPOSIT_AMOUNT
        );

        // Encode Treasury.execute(target, value, data)
        bytes memory treasuryCalldata = abi.encodeWithSignature(
            "execute(address,uint256,bytes)",
            strategyAddress,     // target: Strategy contract
            0,                   // value: no ETH to send
            strategyCalldata     // data: encoded strategy call
        );

        // Prepare proposal arrays
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = treasuryAddress;
        values[0] = 0;
        calldatas[0] = treasuryCalldata;

        string memory description = "Execute Strategy 1: Deposit 10,000 ETHTokens into Aave-like protocol";

        // Create the proposal
        console.log("Creating proposal...");
        uint256 proposalId = governance.propose(
            targets,
            values,
            calldatas,
            description
        );

        console.log("Proposal created with ID:", proposalId);
        console.log("Proposal will deposit", STRATEGY_DEPOSIT_AMOUNT / 1e18, "ETHTokens into Strategy 1");
    }
}