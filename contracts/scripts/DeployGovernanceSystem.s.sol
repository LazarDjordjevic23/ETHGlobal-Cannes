// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./BaseScript.s.sol";
import {DAOToken} from "../src/DAOToken.sol";
import {Governance} from "../src/Governance.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeployGovernanceSystem is BaseScript {

    /**
    * Run this command to deploy the governor:
    * forge script script/DeployGovernanceSystem.s.sol --rpc-url sepolia --broadcast
    */

    function run() external broadcast {
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();

        // Load config json (if you have config parameters, otherwise hardcode)
        (string memory configJson, ) = loadConfig(network);

        // === Deploy DAOToken ===

        // Params from config or hardcoded fallback
        address initialOwner = getConfigAddress(configJson, network, "tokenOwner", _broadcaster);
        string memory tokenName = getConfigString(configJson, network, "tokenName", "My DAO Token");
        string memory tokenSymbol = getConfigString(configJson, network, "tokenSymbol", "MDT");

//        // Load receivers from config (optional, else fallback to deployer only)
//        // Receivers as array of addresses - if not found, fallback to deployer
//        (bytes memory receiversRaw, bool hasReceivers) = getConfigArray(configJson, network, "tokenReceivers");
//        address[] memory receivers;
//        if (hasReceivers) {
//            // Decode address[] from bytes - JSON parsing returns bytes, convert
//            receivers = abi.decode(receiversRaw, (address[]));
//        } else {
//            receivers = new address ;
//            receivers[0] = _broadcaster;
//        }
        address[] memory receivers = new address[](1);
        receivers[0] = 0x65CF522114b232cf5f9172F170d82Bc83676F1d6;
        console.log("Deploying DAOToken with name:", tokenName);
        DAOToken token = new DAOToken(initialOwner, tokenName, tokenSymbol, receivers);
        console.log("DAOToken deployed at:", address(token));

        // Save address and ABI
        (string memory implPath, string memory proxyPath, string memory abiPath) = getDeploymentPaths(stage);
        saveContractAddress(implPath, network, "DAOToken", address(token));
        saveContractABI(abiPath, network, "DAOToken");

        // === Deploy Governance ===

        string memory governorName = getConfigString(configJson, network, "governorName", "MyDAO Governor");
        uint48 votingDelay = uint48(getConfigUint(configJson, network, "votingDelay", 86400)); // 1 day default
        uint32 votingPeriod = uint32(getConfigUint(configJson, network, "votingPeriod", 604800)); // 7 days default
        uint256 quorumNumerator = getConfigUint(configJson, network, "quorumNumerator", 4); // 4%

        uint256 proposalThresholdPercent = uint256(getConfigUint(configJson, network, "proposalThresholdPercent", 604800));
        uint256 threshold = (token.totalSupply() * proposalThresholdPercent) / 100;

        Governance governor = new Governance(
            governorName,
            IVotes(address(token)),
            votingDelay,
            votingPeriod,
            threshold,
            quorumNumerator
        );
        console.log("Governance deployed at:", address(governor));

        saveContractAddress(implPath, network, "Governance", address(governor));
        saveContractABI(abiPath, network, "Governance");
    }
}
