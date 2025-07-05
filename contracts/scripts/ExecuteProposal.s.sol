// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {Governance} from "../src/Governance.sol";

contract ExecuteProposal is BaseScript {

    /**
     * Run this command to execute a passed proposal:
     * forge script scripts/ExecuteProposal.s.sol --rpc-url sepolia --broadcast
     */

    uint256 constant STRATEGY_DEPOSIT_AMOUNT = 1 * 1e18; // Same as proposal creation

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

        uint256 proposalId = 95959446933743489345185149661070899877626769715576455202852791557849037682870;
        console.log("Executing proposal", proposalId, "on network:", network);
        console.log("Governance:", governanceAddress);

        // Initialize governance contract
        Governance governance = Governance(payable(governanceAddress));

        // Encode the same calls as in proposal creation
        bytes memory strategyCalldata = abi.encodeWithSignature(
            "executeStrategy1(address,uint256)",
            ethTokenAddress,
            STRATEGY_DEPOSIT_AMOUNT
        );

        bytes memory treasuryCalldata = abi.encodeWithSignature(
            "execute(address,uint256,bytes)",
            strategyAddress,
            0,
            strategyCalldata
        );

        // Prepare execution arrays (same as proposal)
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);

        targets[0] = treasuryAddress;
        values[0] = 0;
        calldatas[0] = treasuryCalldata;

        string memory description = "Execute Strategy 1: Deposit 10,000 ETHTokens into Aave-like protocol";
        bytes32 descriptionHash = keccak256(bytes(description));

        // Execute the proposal
        console.log("Executing proposal...");
        governance.execute(targets, values, calldatas, descriptionHash);

        console.log("Proposal executed successfully!");
        console.log("10,000 ETHTokens sent from Treasury to Strategy 1");
    }
}