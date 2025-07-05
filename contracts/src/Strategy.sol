// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Strategy
 * @notice Strategy contract with 3 fake strategies that have metrics and execution functions
 */
contract Strategy {
    using SafeERC20 for IERC20;

    // Events
    event Strategy1Executed(address token, uint256 amount);
    event Strategy2Executed(address token, uint256 amount);
    event Strategy3Executed(address token, uint256 amount);

    /**
     * @notice Gets strategy 1 metrics (Aave-like strategy)
     * @return apy Annual Percentage Yield in basis points (e.g., 720 = 7.20%)
     * @return tvl Total Value Locked in wei
     * @return utilizationRate Utilization rate in basis points (e.g., 8200 = 82.00%)
     * @return riskAdjustedReturns Risk-adjusted returns (Sharpe ratio) in basis points (e.g., 180 = 1.80)
     * @return withdrawalLiquidity Immediate withdrawal liquidity percentage in basis points (e.g., 8500 = 85.00%)
     * @return description Strategy description explaining current market position
     */
    function getStrategy1Metrics()
    external
    pure
    returns (
        uint256 apy,
        uint256 tvl,
        uint256 utilizationRate,
        uint256 riskAdjustedReturns,
        uint256 withdrawalLiquidity,
        string memory description
    )
    {
        return (
        720,            // 7.20% APY
        450000000 ether, // $450M TVL
        8200,           // 82.00% utilization rate
        180,            // 1.80 Sharpe ratio
        8500,           // 85.00% withdrawal liquidity
        "Aave Protocol: A fully decentralized lending protocol prioritizing user empowerment and community governance. Known for transparent operations, innovative features like flash loans, and strong commitment to user protection. The protocol operates with complete decentralization, where users retain full control of their assets and decision-making power through democratic governance processes."
        );
    }

    /**
     * @notice Gets strategy 2 metrics (Lido-like strategy)
     * @return apy Annual Percentage Yield in basis points
     * @return tvl Total Value Locked in wei
     * @return utilizationRate Utilization rate in basis points
     * @return riskAdjustedReturns Risk-adjusted returns (Sharpe ratio) in basis points
     * @return withdrawalLiquidity Immediate withdrawal liquidity percentage in basis points
     * @return description Strategy description explaining current market position
     */
    function getStrategy2Metrics()
    external
    pure
    returns (
        uint256 apy,
        uint256 tvl,
        uint256 utilizationRate,
        uint256 riskAdjustedReturns,
        uint256 withdrawalLiquidity,
        string memory description
    )
    {
        return (
        1250,           // 12.50% APY
        230000000 ether, // $230M TVL
        7500,           // 75.00% utilization rate
        220,            // 2.20 Sharpe ratio
        6000,           // 60.00% withdrawal liquidity
        "Lido Finance: A profit-driven liquid staking protocol focused on maximizing revenue and market dominance. While offering competitive yields, the protocol prioritizes financial returns over decentralization ideals. Known for aggressive expansion strategies and centralized validator operations that prioritize efficiency and profitability over community governance principles."
        );
    }

    /**
     * @notice Gets strategy 3 metrics (Compound-like strategy)
     * @return apy Annual Percentage Yield in basis points
     * @return tvl Total Value Locked in wei
     * @return utilizationRate Utilization rate in basis points
     * @return riskAdjustedReturns Risk-adjusted returns (Sharpe ratio) in basis points
     * @return withdrawalLiquidity Immediate withdrawal liquidity percentage in basis points
     * @return description Strategy description explaining current market position
     */
    function getStrategy3Metrics()
    external
    pure
    returns (
        uint256 apy,
        uint256 tvl,
        uint256 utilizationRate,
        uint256 riskAdjustedReturns,
        uint256 withdrawalLiquidity,
        string memory description
    )
    {
        return (
        950,            // 9.50% APY
        180000000 ether, // $180M TVL
        9100,           // 91.00% utilization rate
        150,            // 1.50 Sharpe ratio
        10000,          // 100.00% withdrawal liquidity
        "Compound Protocol: A balanced DeFi lending platform that combines innovation with stability. Focuses on building sustainable financial infrastructure while maintaining reasonable decentralization. Known for algorithmic interest rates, strong developer community, and measured approach to growth that balances user interests with protocol sustainability and long-term viability."
        );
    }

    /**
     * @notice Executes strategy 1 deposit (Aave-like)
     * @param token The ERC20 token to deposit into the strategy
     * @param amount The amount of tokens to deposit
     */
    function executeStrategy1(address token, uint256 amount) external {
        require(token != address(0), "Strategy: token cannot be zero address");
        require(amount > 0, "Strategy: amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Strategy1Executed(token, amount);
    }

    /**
     * @notice Executes strategy 2 deposit (Lido-like)
     * @param token The ERC20 token to deposit into the strategy
     * @param amount The amount of tokens to deposit
     */
    function executeStrategy2(address token, uint256 amount) external {
        require(token != address(0), "Strategy: token cannot be zero address");
        require(amount > 0, "Strategy: amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Strategy2Executed(token, amount);
    }

    /**
     * @notice Executes strategy 3 deposit (Compound-like)
     * @param token The ERC20 token to deposit into the strategy
     * @param amount The amount of tokens to deposit
     */
    function executeStrategy3(address token, uint256 amount) external {
        require(token != address(0), "Strategy: token cannot be zero address");
        require(amount > 0, "Strategy: amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Strategy3Executed(token, amount);
    }

    /**
     * @notice Gets the token balance held by this contract
     * @param token The ERC20 token address
     * @return The balance of the token
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}