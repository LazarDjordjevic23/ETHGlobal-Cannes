// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console2} from "forge-std/Test.sol";
import {Governance} from "../src/Governance.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {IGovernor} from "@openzeppelin/contracts/governance/IGovernor.sol";

// Mock target contract for testing proposals
contract MockTarget {
    uint256 public value;

    function setValue(uint256 _value) external {
        value = _value;
    }
}

contract GovernanceTest is Test {
    Governance public governor;
    DAOToken public token;

    // Test accounts
    address public owner = makeAddr("owner");
    address public voter1 = makeAddr("voter1");
    address public voter2 = makeAddr("voter2");
    address public voter3 = makeAddr("voter3");
    address public voter4 = makeAddr("voter4");
    address public voter5 = makeAddr("voter5");

    // Mock target contract for proposals
    MockTarget public mockTarget;

    // Governance parameters
    uint48 public constant VOTING_DELAY = 0; // No delay
    uint32 public constant VOTING_PERIOD = 180; // 3 minutes
    uint256 public constant PROPOSAL_THRESHOLD = 0; // No threshold
    uint256 public constant QUORUM_PERCENTAGE = 20; // 20%

    // Token distribution
    uint256 public constant TOTAL_SUPPLY = 1000e18;
    uint256 public constant VOTER_BALANCE = 200e18; // Each voter gets 200 tokens (1000/5 = 200)

    // Helper to move time forward in tests
    function moveTimeForward(uint256 seconds_) internal {
        vm.warp(block.timestamp + seconds_);
    }

    function setUp() public {
        // Start at a reasonable timestamp
        vm.warp(1000);

        // Deploy token with 5 voters
        address[] memory receivers = new address[](5);
        receivers[0] = voter1;
        receivers[1] = voter2;
        receivers[2] = voter3;
        receivers[3] = voter4;
        receivers[4] = voter5;

        token = new DAOToken("DAO Token", "DAO", receivers);

        // Deploy governance
        governor = new Governance(
            "DAO Governor",
            IVotes(address(token)),
            VOTING_DELAY,
            VOTING_PERIOD,
            PROPOSAL_THRESHOLD,
            QUORUM_PERCENTAGE
        );

        // Deploy mock target
        mockTarget = new MockTarget();

        // Delegate voting power to themselves
        vm.prank(voter1);
        token.delegate(voter1);

        vm.prank(voter2);
        token.delegate(voter2);

        vm.prank(voter3);
        token.delegate(voter3);

        vm.prank(voter4);
        token.delegate(voter4);

        vm.prank(voter5);
        token.delegate(voter5);
    }

    function test_CreateProposal() public {
        // Prepare proposal data
        address[] memory targets = new address[](1);
        targets[0] = address(mockTarget);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSelector(MockTarget.setValue.selector, 42);

        string memory description = "Set value to 42";

        // Create proposal
        vm.prank(voter1);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        // Check proposal state is Pending (0)
        assertEq(uint256(governor.state(proposalId)), 0);
        console2.log("Proposal created with ID:", proposalId);
    }

    function test_CreateProposalAndVote() public {
        // Prepare proposal data
        address[] memory targets = new address[](1);
        targets[0] = address(mockTarget);

        uint256[] memory values = new uint256[](1);
        values[0] = 0;

        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSelector(MockTarget.setValue.selector, 42);

        string memory description = "Set value to 42";

        // Create proposal
        vm.prank(voter1);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        moveTimeForward(5);

        // Since voting delay is 0, voting should be active immediately
        assertEq(uint256(governor.state(proposalId)), 1); // Active

        // Vote FOR (1) with voter1
        vm.prank(voter1);
        governor.castVote(proposalId, 1);

        // Vote FOR (1) with voter2
        vm.prank(voter2);
        governor.castVote(proposalId, 1);

        moveTimeForward(5);

        // Check votes - voter1 and voter2 each have 200 tokens
        (uint256 againstVotes, uint256 forVotes, uint256 abstainVotes) = governor.proposalVotes(proposalId);
        assertEq(forVotes, 400e18); // 200 + 200
        assertEq(againstVotes, 0);
        assertEq(abstainVotes, 0);

        console2.log("For votes:", forVotes / 1e18);
        console2.log("Against votes:", againstVotes / 1e18);
    }

    function test_QuorumReachedWithMixedVotes() public {
        // Create proposal
        vm.prank(voter1);
        uint256 proposalId = governor.propose(
            new address[](1),
            new uint256[](1),
            new bytes[](1),
            "Test quorum"
        );

        // Move past voting delay
        moveTimeForward(VOTING_DELAY + 1);

        // 2 FOR (400), 1 AGAINST (200), 1 ABSTAIN (200) = 800 total (80% participation)
        vm.prank(voter1);
        governor.castVote(proposalId, 1); // FOR
        vm.prank(voter2);
        governor.castVote(proposalId, 1); // FOR
        vm.prank(voter3);
        governor.castVote(proposalId, 0); // AGAINST
        vm.prank(voter4);
        governor.castVote(proposalId, 2); // ABSTAIN

        moveTimeForward(VOTING_PERIOD);

        // Verify quorum was reached (20% required) and proposal succeeded (more FOR than AGAINST)
        assertEq(uint256(governor.state(proposalId)), 4); // Succeeded
    }

    function test_ProposalExecutionChangesState() public {
        // Setup proposal to change mock contract's value
        address[] memory targets = new address[](1);
        targets[0] = address(mockTarget);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        calldatas[0] = abi.encodeWithSelector(MockTarget.setValue.selector, 123);
        string memory description = "Set value to 123";

        // Create proposal
        vm.prank(voter1);
        uint256 proposalId = governor.propose(targets, values, calldatas, description);

        // Move past voting delay
        moveTimeForward(VOTING_DELAY + 1);

        // Vote to pass (3 voters = 600 tokens - 60% participation)
        vm.prank(voter1);
        governor.castVote(proposalId, 1); // FOR
        vm.prank(voter2);
        governor.castVote(proposalId, 1); // FOR
        vm.prank(voter3);
        governor.castVote(proposalId, 1); // FOR

        // Move past voting period
        moveTimeForward(VOTING_PERIOD + 1);

        // Verify proposal succeeded
        assertEq(uint256(governor.state(proposalId)), 4, "Proposal should be in Succeeded state");

        // Execute the proposal
        vm.prank(voter1); // Can be executed by anyone
        governor.execute(
            targets,
            values,
            calldatas,
            keccak256(bytes(description))
        );

        // Verify the target contract's state changed
        assertEq(mockTarget.value(), 123, "Proposal execution should update value");

        // Verify proposal marked as executed
        assertTrue(governor.hasVoted(proposalId, voter1), "Voter1 should have voted");
        assertTrue(governor.hasVoted(proposalId, voter2), "Voter2 should have voted");
        assertTrue(governor.hasVoted(proposalId, voter3), "Voter3 should have voted");
    }
}