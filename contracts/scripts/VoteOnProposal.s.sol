// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {Governance} from "../src/Governance.sol";

contract VoteOnProposal is BaseScript {

    /**
     * Run this command to vote on a proposal:
     * forge script scripts/VoteOnProposal.s.sol --rpc-url sepolia --broadcast
     *
     * 0 = Against
     * 1 = For
     * 2 = Abstain
     */

    function run() external broadcast {
        // Get network and load addresses
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();
        (string memory addressesPath,,) = getDeploymentPaths(stage);
        string memory addressJson = loadAddressFile(addressesPath);

        // Get governance address
        address governanceAddress = getContractAddress(addressJson, network, "Governance");

        uint256 proposalId = 81882712182884131001518211983589859132345454893186885172772635910663584985254;
        uint8 support = 1;
        console.log("Voting on proposal", proposalId, "on network:", network);
        console.log("Governance:", governanceAddress);

        // Initialize governance contract
        Governance governance = Governance(payable(governanceAddress));
        governance.castVote(proposalId, support);

        console.log("Vote cast successfully!");
    }
}