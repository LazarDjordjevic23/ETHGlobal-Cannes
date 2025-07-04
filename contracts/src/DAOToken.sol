// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

contract DAOToken is ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {

    uint256 immutable supply = 1000 * 1e18;

    constructor(
        string memory _name,
        string memory _symbol,
        address[] memory receivers
    )
        ERC20(_name, _symbol)
        ERC20Permit(_name)
    {
//        uint256 nofReceivers = receivers.length;
//        for (uint256 i = 0; i < nofReceivers; i++){
//            address receiver = receivers[i];
//            _mint(receiver, supply / nofReceivers);
//            // _delegate(receiver, receiver);
//        }
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
    internal
    override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
    public
    view
    override(ERC20Permit, Nonces)
    returns (uint256)
    {
        return super.nonces(owner);
    }
}
