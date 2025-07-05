// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./BaseScript.s.sol";
import {Governance} from "../src/Governance.sol";

contract VoteOnLastProposal is BaseScript {

    /**
     * Run this command to vote on the last proposal:
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

        console.log("Getting last proposal on network:", network);
        console.log("Governance:", governanceAddress);

        // Initialize governance contract
        Governance governance = Governance(payable(governanceAddress));

        // Get total proposals
        uint256 proposalCount = governance.proposalCount();
        console.log("Total proposals:", proposalCount);

        require(proposalCount > 0, "No proposals found");

        // Get last proposal ID
        uint256 lastIndex = proposalCount - 1;
        (uint256 lastProposalId,,,, ) = governance.proposalDetailsAt(lastIndex);

        console.log("Last proposal ID:", lastProposalId);

        // Vote settings
        uint8 support = 1; // 1 = For, 0 = Against, 2 = Abstain

        console.log("Casting vote (1=For, 0=Against, 2=Abstain):", support);

        // Cast vote on the last proposal
        governance.castVote(lastProposalId, support);

        console.log("Vote cast successfully on proposal:", lastProposalId);
    }
}