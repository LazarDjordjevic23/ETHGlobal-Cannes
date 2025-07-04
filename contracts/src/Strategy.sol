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
     * @notice Gets strategy 1 metrics
     * @return apy Annual Percentage Yield in basis points (e.g., 720 = 7.20%)
     * @return tvl Total Value Locked in wei
     * @return utilizationRate Utilization rate in basis points (e.g., 8200 = 82.00%)
     * @return riskAdjustedReturns Risk-adjusted returns (Sharpe ratio) in basis points (e.g., 180 = 1.80)
     * @return withdrawalLiquidity Immediate withdrawal liquidity percentage in basis points (e.g., 8500 = 85.00%)
     */
    function getStrategy1Metrics()
    external
    pure
    returns (
        uint256 apy,
        uint256 tvl,
        uint256 utilizationRate,
        uint256 riskAdjustedReturns,
        uint256 withdrawalLiquidity
    )
    {
        return (
        720,            // 7.20% APY
        450000000 ether, // $450M TVL
        8200,           // 82.00% utilization rate
        180,            // 1.80 Sharpe ratio
        8500            // 85.00% withdrawal liquidity
        );
    }

    /**
     * @notice Gets strategy 2 metrics
     * @return apy Annual Percentage Yield in basis points
     * @return tvl Total Value Locked in wei
     * @return utilizationRate Utilization rate in basis points
     * @return riskAdjustedReturns Risk-adjusted returns (Sharpe ratio) in basis points
     * @return withdrawalLiquidity Immediate withdrawal liquidity percentage in basis points
     */
    function getStrategy2Metrics()
    external
    pure
    returns (
        uint256 apy,
        uint256 tvl,
        uint256 utilizationRate,
        uint256 riskAdjustedReturns,
        uint256 withdrawalLiquidity
    )
    {
        return (
        1250,           // 12.50% APY
        230000000 ether, // $230M TVL
        7500,           // 75.00% utilization rate
        220,            // 2.20 Sharpe ratio
        6000            // 60.00% withdrawal liquidity
        );
    }

    /**
     * @notice Gets strategy 3 metrics
     * @return apy Annual Percentage Yield in basis points
     * @return tvl Total Value Locked in wei
     * @return utilizationRate Utilization rate in basis points
     * @return riskAdjustedReturns Risk-adjusted returns (Sharpe ratio) in basis points
     * @return withdrawalLiquidity Immediate withdrawal liquidity percentage in basis points
     */
    function getStrategy3Metrics()
    external
    pure
    returns (
        uint256 apy,
        uint256 tvl,
        uint256 utilizationRate,
        uint256 riskAdjustedReturns,
        uint256 withdrawalLiquidity
    )
    {
        return (
        950,            // 9.50% APY
        180000000 ether, // $180M TVL
        9100,           // 91.00% utilization rate
        150,            // 1.50 Sharpe ratio
        10000           // 100.00% withdrawal liquidity
        );
    }

    /**
     * @notice Executes strategy 1 with the given token
     * @param token The ERC20 token to use in the strategy
     * @param amount The amount of tokens to use
     */
    function executeStrategy1(address token, uint256 amount) external {
        require(token != address(0), "Strategy: token cannot be zero address");
        require(amount > 0, "Strategy: amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Strategy1Executed(token, amount);
    }

    /**
     * @notice Executes strategy 2 with the given token
     * @param token The ERC20 token to use in the strategy
     * @param amount The amount of tokens to use
     */
    function executeStrategy2(address token, uint256 amount) external {
        require(token != address(0), "Strategy: token cannot be zero address");
        require(amount > 0, "Strategy: amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Strategy2Executed(token, amount);
    }

    /**
     * @notice Executes strategy 3 with the given token
     * @param token The ERC20 token to use in the strategy
     * @param amount The amount of tokens to use
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