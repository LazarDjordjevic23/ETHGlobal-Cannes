// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.28;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorStorage} from "@openzeppelin/contracts/governance/extensions/GovernorStorage.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorVotesQuorumFraction} from "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";

/**
 * @title MyGovernor
 * @notice A comprehensive governance contract implementing OpenZeppelin's Governor framework
 * @dev This contract combines multiple governance extensions:
 *      - GovernorSettings: Configurable voting delay, period, and proposal threshold
 *      - GovernorCountingSimple: Simple For/Against/Abstain vote counting
 *      - GovernorStorage: On-chain proposal storage for transparency
 *      - GovernorVotes: Integration with ERC20Votes or ERC721Votes tokens
 *      - GovernorVotesQuorumFraction: Percentage-based quorum calculation
 */
contract MyGovernor is
Governor,
GovernorSettings,
GovernorCountingSimple,
GovernorStorage,
GovernorVotes,
GovernorVotesQuorumFraction
{
    /**
     * @notice Initializes the Governor contract with specified parameters
     * @dev All parameters are immutable after deployment. Choose values carefully.
     * @param _name The name of the governance contract (e.g., "MyDAO Governor")
     * @param _token The voting token contract that implements IVotes interface
     * @param _initialVotingDelay Delay in seconds before voting starts after proposal creation
     * @param _initialVotingPeriod Duration in seconds that voting remains open
     * @param _initialProposalThreshold Minimum token balance required to create proposals
     * @param _quorumNumeratorValue Numerator for quorum calculation (denominator is 100)
     *
     * @dev Example values for a typical DAO:
     *      - _initialVotingDelay: 86400 (1 day)
     *      - _initialVotingPeriod: 604800 (7 days)
     *      - _initialProposalThreshold: 1000e18 (1000 tokens)
     *      - _quorumNumeratorValue: 4 (4% quorum)
     */
    constructor(
        string memory _name,
        IVotes _token,
        uint48 _initialVotingDelay,
        uint32 _initialVotingPeriod,
        uint256 _initialProposalThreshold,
        uint256 _quorumNumeratorValue,
        uint48 _initialVoteExtension
    )
    Governor(_name)
    GovernorSettings(_initialVotingDelay, _initialVotingPeriod, _initialProposalThreshold)
    GovernorVotes(_token)
    GovernorVotesQuorumFraction(_quorumNumeratorValue)
    {}

    ////////////////////////////////////////////////////////////////////////////
    // OpenZeppelin Governance Getter Function Overrides
    ////////////////////////////////////////////////////////////////////////////

    /**
     * @notice Returns the delay between proposal creation and voting start
     * @dev Overrides both Governor and GovernorSettings implementations
     * @return The voting delay in seconds (timestamp mode) or blocks (block mode)
     */
    function votingDelay()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
    {
        return super.votingDelay();
    }

    /**
     * @notice Returns the duration of the voting period
     * @dev Overrides both Governor and GovernorSettings implementations
     * @return The voting period duration in seconds (timestamp mode) or blocks (block mode)
     */
    function votingPeriod()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
    {
        return super.votingPeriod();
    }

    /**
     * @notice Calculates the quorum required for a proposal to succeed at a given block
     * @dev Overrides both Governor and GovernorVotesQuorumFraction implementations
     * @param blockNumber The block number to calculate quorum for (affects total supply)
     * @return The minimum number of votes required for quorum
     */
    function quorum(uint256 blockNumber)
    public
    view
    override(Governor, GovernorVotesQuorumFraction)
    returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    /**
     * @notice Returns the current lifecycle state of a proposal
     * @dev States: Pending → Active → [Canceled/Defeated/Succeeded] → [Queued] → Executed
     * @param proposalId The unique identifier of the proposal
     * @return The current ProposalState enum value
     */
    function state(uint256 proposalId)
    public
    view
    override(Governor)
    returns (ProposalState)
    {
        return super.state(proposalId);
    }

    /**
     * @notice Returns the minimum token balance required to create proposals
     * @dev Overrides both Governor and GovernorSettings implementations
     * @return The proposal threshold in token units (including decimals)
     */
    function proposalThreshold()
    public
    view
    override(Governor, GovernorSettings)
    returns (uint256)
    {
        return super.proposalThreshold();
    }

    /**
     * @notice Returns the deadline for voting on a proposal, including any extensions
     * @dev Overrides Governor implementations
     *      The deadline may be extended if quorum is reached close to the original deadline
     * @param proposalId The unique identifier of the proposal
     * @return The final voting deadline as a timestamp or block number
     */
    function proposalDeadline(uint256 proposalId)
    public
    view
    override(Governor)
    returns (uint256)
    {
        return super.proposalDeadline(proposalId);
    }

    /**
     * @notice Returns the address authorized to execute proposals
     * @dev By default, this is the Governor contract itself (self-executing)
     *      Can be overridden to use a Timelock or other executor contract
     * @return The executor address (typically address(this) for self-execution)
     */
    function _executor()
    internal
    view
    override(Governor)
    returns (address)
    {
        return super._executor();
    }

    /**
     * @notice Returns the current clock value used for voting timestamps
     * @dev This contract uses timestamp mode instead of block numbers for better predictability
     *      Overrides both Governor and GovernorVotes implementations
     * @return The current timestamp as a uint48
     */
    function clock()
    public
    view
    override(Governor, GovernorVotes)
    returns (uint48)
    {
        return uint48(block.timestamp);
    }

    /**
     * @notice Returns the clock mode description for this Governor
     * @dev Indicates that this contract uses timestamps rather than block numbers
     *      Overrides both Governor and GovernorVotes implementations
     * @return A string describing the clock mode ("mode=timestamp")
     */
    function CLOCK_MODE()
    public
    view
    virtual
    override(Governor, GovernorVotes)
    returns (string memory)
    {
        return "mode=timestamp";
    }

    ////////////////////////////////////////////////////////////////////////////
    // OpenZeppelin Governance Internal Function Overrides
    ////////////////////////////////////////////////////////////////////////////

    /**
     * @notice Internal hook called after vote tallies are updated
     * @dev Overrides Governor implementations
     * @param proposalId The unique identifier of the proposal whose tally was updated
     */
    function _tallyUpdated(uint256 proposalId)
    internal
    override(Governor)
    {
        super._tallyUpdated(proposalId);
    }

    /**
     * @notice Internal function to create a new proposal
     * @dev Overrides both Governor and GovernorStorage implementations
     *      GovernorStorage stores proposal data on-chain for transparency
     * @param targets Array of contract addresses to call
     * @param values Array of ETH amounts to send with each call
     * @param calldatas Array of encoded function calls
     * @param description Human-readable proposal description
     * @param proposer Address of the account creating the proposal
     * @return The unique proposal ID
     */
    function _propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        address proposer
    )
    internal
    override(Governor, GovernorStorage)
    returns (uint256)
    {
        return super._propose(targets, values, calldatas, description, proposer);
    }

    /**
     * @notice Internal function to cancel a proposal
     * @dev Can only be called by the proposer or if proposer's voting power drops below threshold
     * @param targets Array of contract addresses from the proposal
     * @param values Array of ETH amounts from the proposal
     * @param calldatas Array of encoded function calls from the proposal
     * @param descriptionHash Keccak256 hash of the proposal description
     * @return The ID of the canceled proposal
     */
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
    internal
    override(Governor)
    returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    /**
     * @notice Internal function to cast a vote on a proposal
     * @dev This is called by all public voting functions (castVote, castVoteWithReason, etc.)
     *      Only overrides Governor since GovernorPreventLateQuorum doesn't modify vote casting
     * @param proposalId The unique identifier of the proposal
     * @param account The address of the voter
     * @param support The vote type: 0=Against, 1=For, 2=Abstain
     * @param reason Optional reason string for the vote
     * @param params Optional extra parameters (unused in this implementation)
     * @return The voting weight of the cast vote
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
    returns (uint256)
    {
        return super._castVote(proposalId, account, support, reason, params);
    }
}