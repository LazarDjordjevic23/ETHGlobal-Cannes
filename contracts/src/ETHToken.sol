// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ETHToken is ERC20 {
    constructor(address initialOwner)
    ERC20("Ethereum", "ETH")
    {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
