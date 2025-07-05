// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import { SimplePaymaster } from "../src/SimplePaymaster.sol";

// Alternative script with custom deposit amount
contract PaymasterDeposit is BaseScript {

    /**
    * Run this command to deposit custom amount:
    * forge script scripts/PaymasterDeposit.s.sol --rpc-url sepolia --broadcast
    */

    function run() external broadcast {
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();

        (
        string memory addressesPath,
        ,  // We don't need proxy addresses for Treasury
        string memory abiPath
        ) = getDeploymentPaths(stage);

        // Step 3: Load JSON files with contract addresses
        string memory addressJson = loadAddressFile(addressesPath);
        address paymasterAddress = getContractAddress(addressJson, network, "SimplePaymaster");
        require(paymasterAddress != address(0), "Paymaster address not found");

        console.log("=== CUSTOM PAYMASTER DEPOSIT ===");
        console.log("Network:", network);
        console.log("Paymaster address:", paymasterAddress);

        uint256 depositAmount = 0.08 ether;
        console.log("Custom deposit amount:", depositAmount);

        SimplePaymaster paymaster = SimplePaymaster(paymasterAddress);

        // Check balances
        uint256 balanceBefore = paymaster.getDeposit();
        console.log("Paymaster balance before:", balanceBefore);
        console.log("Depositor ETH balance:", msg.sender.balance);

        require(msg.sender.balance >= depositAmount, "Insufficient ETH balance");

        // Make deposit
        paymaster.deposit{value: depositAmount}();

        uint256 balanceAfter = paymaster.getDeposit();
        console.log("Paymaster balance after:", balanceAfter);

        console.log("=== CUSTOM DEPOSIT SUCCESSFUL ===");
        console.log("Deposited:", depositAmount);
        console.log("Paymaster ready for gas sponsorship!");
    }
}