// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@account-abstraction/contracts/interfaces/PackedUserOperation.sol";

/**
 * @title SimplePaymaster
 * @notice A simple paymaster that sponsors gas for any operation
 */
contract SimplePaymaster is BasePaymaster {

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}

    /**
     * @notice Validate paymaster user operation - accepts all operations
     */
    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal pure override returns (bytes memory context, uint256 validationData) {
        // Accept all operations
        return ("", 0);
    }
}