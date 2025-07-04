// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.28;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorStorage} from "@openzeppelin/contracts/governance/extensions/GovernorStorage.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorPreventLateQuorum.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

contract MyGovernor is
Governor,
GovernorSettings,
GovernorCountingSimple,
GovernorStorage,
GovernorVotes,
GovernorPreventLateQuorum,
GovernorVotesQuorumFraction
{
    constructor(
        string memory _name,
        IVotes _token,
        uint48 _initialVotingDelay,  // Changed from int48 to uint48
        uint32 _initialVotingPeriod,
        uint256 _initialProposalThreshold,
        uint256 _quorumNumeratorValue,
        uint48 _initialVoteExtension
    )
    Governor(_name)
    GovernorSettings(_initialVotingDelay, _initialVotingPeriod, _initialProposalThreshold)
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(_quorumNumeratorValue)
    GovernorPreventLateQuorum(_initialVoteExtension)
    {}

    ////////////////////////////////////////////////////////////////////////////
    // OpenZeppelin Governance Getter Function Overrides
    ////////////////////////////////////////////////////////////////////////////

    /**
     * @notice Retrieves the voting delay configured in the settings.
     * @return The configured voting delay.
     */
    function votingDelay()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
    { return super.votingDelay(); }

    /**
     * @notice Retrieves the voting period configured in the settings.
     * @return The configured voting period.
     */
    function votingPeriod()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
    { return super.votingPeriod(); }

    /**
     * @notice Retrieves the quorum required for a vote to succeed.
     * @param blockNumber The block number for which to determine the quorum.
     * @return The required quorum at the given block number.
     */
    function quorum(uint256 blockNumber)
    public
    view
    override(Governor, GovernorVotesQuorumFraction)
    returns (uint256)
    { return super.quorum(blockNumber); }

    /**
     * @notice Retrieves the current state of a proposal.
     * @param proposalId The ID of the proposal to query.
     * @return The current state of the proposal (e.g., Pending, Active, Canceled, Defeated, Succeeded, Queued, Executed).
     */
    function state(uint256 proposalId)
    public
    view
    override(Governor)
    returns (ProposalState)
    { return super.state(proposalId); }

    /**
     * @notice Retrieves the threshold required for a proposal to be enacted.
     * @return The threshold required for a proposal to be enacted.
     */
    function proposalThreshold()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
    { return super.proposalThreshold(); }

    /**
     * @notice Retrieves the proposal deadline, accounting for late quorum extensions.
     * @param proposalId The ID of the proposal to query.
     * @return The deadline for the proposal.
     */
    function proposalDeadline(uint256 proposalId)
    public
    view
    override(Governor, GovernorPreventLateQuorum)
    returns (uint256)
    { return super.proposalDeadline(proposalId); }

    /**
     * @notice Internal function called when vote tallies are updated.
     * @param proposalId The ID of the proposal whose tally was updated.
     */
    function _tallyUpdated(uint256 proposalId)
    internal
    override(Governor, GovernorPreventLateQuorum)
    { super._tallyUpdated(proposalId); }

    /**
     * @notice Retrieves the address of the executor configured in the timelock control.
     * @return The address of the executor.
     */
    function _executor()
    internal
    view
    override(Governor)
    returns (address)
    { return super._executor(); }

    /**
     * @dev Returns the current timestamp as a `uint48`.
     * @return The current timestamp.
     */
    function clock()
    public
    view
    override(Governor,GovernorVotes)
    returns (uint48) { return uint48(block.timestamp); }

    /**
     * @dev Returns the clock mode as a string.
     * @return The clock mode.
     */
    function CLOCK_MODE()
    public
    view
    virtual
    override(Governor,GovernorVotes)
    returns (string memory) { return "mode=timestamp"; }

    ////////////////////////////////////////////////////////////////////////////
    // OpenZeppelin Governance Function Overrides
    ////////////////////////////////////////////////////////////////////////////

    function _propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description, address proposer)
    internal
    override(Governor, GovernorStorage)
    returns (uint256)
    {
        return super._propose(targets, values, calldatas, description, proposer);
    }

    /**
     * @notice Cancels operations from a proposal.
     * @param targets The addresses of the contracts to interact with.
     * @param values The values (ETH) to send in the interactions.
     * @param calldatas The encoded data of the interactions.
     * @param descriptionHash The hash of the proposal description.
     * @return The ID of the canceled proposal.
     */
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
    internal
    override(Governor)
    returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @notice Casts a vote on a proposal.
     * @param proposalId The ID of the proposal to vote on.
     * @param account The address of the voter.
     * @param support The vote choice (true for yes, false for no).
     * @param reason A brief description of the reason for the vote.
     * @param params The parameters for the vote.
     * @return The ID of the vote.
     */
    function _castVote(
        uint256 proposalId,
        address account,
        uint8 support,
        string memory reason,
        bytes memory params
    )
    internal
    virtual
    override(Governor)
    returns (uint256) { return super._castVote(proposalId, account, support, reason,params); }
}