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
        int48 _initialVotingDelay,
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

    // The following functions are overrides required by Solidity.

    function _propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description, address proposer)
    internal
    override(Governor, GovernorStorage)
    returns (uint256)
    {
        return super._propose(targets, values, calldatas, description, proposer);
    }
}
