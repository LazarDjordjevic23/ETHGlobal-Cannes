// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Treasury
 * @notice A treasury contract that holds and manages funds for a DAO
 * @dev This contract is designed to be owned by a governance contract
 *      Only the owner (governance) can authorize fund transfers
 */
contract Treasury is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Events
    event EtherDeposited(address indexed depositor, uint256 amount);
    event EtherWithdrawn(address indexed recipient, uint256 amount);
    event TokenDeposited(address indexed token, address indexed depositor, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event EmergencyWithdrawal(address indexed token, address indexed recipient, uint256 amount);

    /**
     * @notice Initializes the Treasury contract
     * @param _governance The governance contract that will own this treasury
     */
    constructor(address _governance) Ownable(_governance) {
        require(_governance != address(0), "Treasury: governance cannot be zero address");
    }

    /**
     * @notice Allows the contract to receive Ether
     */
    receive() external payable {
        emit EtherDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Allows anyone to deposit Ether to the treasury
     */
    function depositEther() external payable {
        require(msg.value > 0, "Treasury: must deposit more than 0");
        emit EtherDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Allows anyone to deposit ERC20 tokens to the treasury
     * @param token The ERC20 token contract address
     * @param amount The amount of tokens to deposit
     */
    function depositToken(address token, uint256 amount) external {
        require(token != address(0), "Treasury: token cannot be zero address");
        require(amount > 0, "Treasury: must deposit more than 0");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit TokenDeposited(token, msg.sender, amount);
    }

    /**
     * @notice Withdraws Ether from the treasury (only governance)
     * @param recipient The address to receive the Ether
     * @param amount The amount of Ether to withdraw
     */
    function withdrawEther(address payable recipient, uint256 amount)
    external
    onlyOwner
    nonReentrant
    {
        require(recipient != address(0), "Treasury: recipient cannot be zero address");
        require(amount > 0, "Treasury: amount must be greater than 0");
        require(address(this).balance >= amount, "Treasury: insufficient Ether balance");

        recipient.transfer(amount);
        emit EtherWithdrawn(recipient, amount);
    }

    /**
     * @notice Withdraws ERC20 tokens from the treasury (only governance)
     * @param token The ERC20 token contract address
     * @param recipient The address to receive the tokens
     * @param amount The amount of tokens to withdraw
     */
    function withdrawToken(address token, address recipient, uint256 amount)
    external
    onlyOwner
    nonReentrant
    {
        require(token != address(0), "Treasury: token cannot be zero address");
        require(recipient != address(0), "Treasury: recipient cannot be zero address");
        require(amount > 0, "Treasury: amount must be greater than 0");

        IERC20 tokenContract = IERC20(token);
        require(tokenContract.balanceOf(address(this)) >= amount, "Treasury: insufficient token balance");

        tokenContract.safeTransfer(recipient, amount);
        emit TokenWithdrawn(token, recipient, amount);
    }

    /**
     * @notice Emergency withdrawal function (only governance)
     * @dev This function allows governance to withdraw all funds of a specific token
     * @param token The ERC20 token contract address (use address(0) for Ether)
     * @param recipient The address to receive the funds
     */
    function emergencyWithdraw(address token, address payable recipient)
    external
    onlyOwner
    nonReentrant
    {
        require(recipient != address(0), "Treasury: recipient cannot be zero address");

        if (token == address(0)) {
            // Withdraw all Ether
            uint256 balance = address(this).balance;
            require(balance > 0, "Treasury: no Ether to withdraw");

            recipient.transfer(balance);
            emit EmergencyWithdrawal(token, recipient, balance);
        } else {
            // Withdraw all tokens
            IERC20 tokenContract = IERC20(token);
            uint256 balance = tokenContract.balanceOf(address(this));
            require(balance > 0, "Treasury: no tokens to withdraw");

            tokenContract.safeTransfer(recipient, balance);
            emit EmergencyWithdrawal(token, recipient, balance);
        }
    }

    /**
 * @notice Execute arbitrary calls (only governance)
 * @dev This allows governance to make any call through the treasury
 * @param target The contract to call
 * @param value The amount of Ether to send with the call
 * @param data The calldata to execute
 * @return success Whether the call was successful
 * @return returnData The return data from the call
 */
    function execute(address target, uint256 value, bytes calldata data)
    external
    onlyOwner
    nonReentrant
    returns (bool success, bytes memory returnData)
    {
        require(target != address(0), "Treasury: target cannot be zero address");
        require(address(this).balance >= value, "Treasury: insufficient Ether for call");

        // Check if this is a call to executeStrategy1, executeStrategy2, or executeStrategy3
        bytes4 selector = bytes4(data[:4]);
        if (selector == bytes4(keccak256("executeStrategy1(address,uint256)")) ||
        selector == bytes4(keccak256("executeStrategy2(address,uint256)")) ||
            selector == bytes4(keccak256("executeStrategy3(address,uint256)"))) {

            // Decode the token and amount from the calldata
            (address token, uint256 amount) = abi.decode(data[4:], (address, uint256));

            // Approve the strategy to spend our tokens
            IERC20 tokenContract = IERC20(token);
            require(tokenContract.balanceOf(address(this)) >= amount, "Treasury: insufficient token balance");

            // Approve the strategy contract to spend the tokens
            require(tokenContract.approve(target, amount), "Treasury: approval failed");
        }

        (success, returnData) = target.call{value: value}(data);
        require(success, "Treasury: call failed");

        // Reset approval to 0 for security (prevent any leftover approvals)
        if (selector == bytes4(keccak256("executeStrategy1(address,uint256)")) ||
        selector == bytes4(keccak256("executeStrategy2(address,uint256)")) ||
            selector == bytes4(keccak256("executeStrategy3(address,uint256)"))) {

            (address token,) = abi.decode(data[4:], (address, uint256));
            IERC20(token).approve(target, 0);
        }
    }

    /**
     * @notice Get the Ether balance of the treasury
     * @return The current Ether balance
     */
    function getEtherBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Get the token balance of the treasury
     * @param token The ERC20 token contract address
     * @return The current token balance
     */
    function getTokenBalance(address token) external view returns (uint256) {
        require(token != address(0), "Treasury: token cannot be zero address");
        return IERC20(token).balanceOf(address(this));
    }

    /**
     * @notice Get the governance address (owner)
     * @return The address of the governance contract
     */
    function getGovernance() external view returns (address) {
        return owner();
    }
}