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
    * forge script scripts/DeployGovernanceSystem.s.sol --rpc-url sepolia --broadcast
    */

    function run() external broadcast {
        string memory network = getNetworkName();
        string memory stage = getDeploymentStage();

        // Load config json (if you have config parameters, otherwise hardcode)
        (string memory configJson, ) = loadConfig(network);

        // === Deploy DAOToken ===

        // Params from config or hardcoded fallback
        string memory tokenName = "DAO Token";
        string memory tokenSymbol = "DAO";

        address[] memory receivers = new address[](2);
        receivers[0] = 0x65CF522114b232cf5f9172F170d82Bc83676F1d6;
        receivers[1] = 0xd5D03F2d454fF295E24DcB9035E233b57087B641;

        console.log("Deploying DAOToken with name:", tokenName);
        DAOToken token = new DAOToken(tokenName, tokenSymbol, receivers);
        console.log("DAOToken deployed at:", address(token));

        // Save address and ABI
        (string memory implPath, string memory proxyPath, string memory abiPath) = getDeploymentPaths(stage);
        saveContractAddress(implPath, network, "DAOToken", address(token));
        saveContractABI(abiPath, network, "DAOToken");

        // === Deploy Governance ===

        string memory governorName = "DAO Governance";
        uint48 votingDelay = 0;
        uint32 votingPeriod = 180;
        uint256 quorumNumerator = 20;
        uint256 proposalThresholdPercent = 0;
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
