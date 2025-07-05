// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "forge-std/console.sol";

/**
 * @title Base Script for Deployments
 * @notice Provides core functionality for deployment scripts including environment management,
 * configuration loading, and artifact handling
 * @dev This contract should be inherited by all deployment scripts
 */
abstract contract BaseScript is Script {

    // ======== CONSTANTS ========

    /// @dev Default fallback private key (only used if no PK in env and not on local Anvil)
    uint256 internal constant FALLBACK_PK = 0x1234567890123456789012345678901234567890123456789012345678901234;

    /// @dev Path to deployment artifacts directory
    string constant DEPLOYMENTS_DIR = "scripts/deployments";

    /// @dev Path to deployment configuration file
    string constant CONFIG_PATH = "scripts/deployments/deploymentConfig.json";

    // ======== STATE VARIABLES ========

    /// @dev Private key used for transaction broadcasting
    uint256 internal _deployerPrivateKey;

    /// @dev Address derived from the deployer private key
    address internal _broadcaster;

    // ======== MODIFIERS ========

    /**
     * @dev Modifier to handle broadcasting transactions
     * @notice Automatically starts and stops broadcasting using the deployer private key
     */
    modifier broadcast() {
        vm.startBroadcast(_deployerPrivateKey);
        _;
        vm.stopBroadcast();
    }

    // ======== CONSTRUCTOR ========

    /**
     * @dev Sets up the deployer key and broadcaster address based on environment
     */
    constructor() {
        // Initialize deployer key based on environment
        if (isAnvil()) {
            // Use first Anvil account for local development
            _deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        } else {
            // Use PK from environment with fallback
            _deployerPrivateKey = vm.envOr("PRIVATE_KEY", FALLBACK_PK);
        }

        // Derive broadcaster address from private key
        _broadcaster = vm.addr(_deployerPrivateKey);
        console.log("Broadcaster address:", _broadcaster);
    }

    // ======== NETWORK FUNCTIONS ========

    /**
     * @dev Check if currently on Ethereum mainnet
     * @return bool True if the current chain is mainnet
     */
    function isMainnet() internal view returns (bool) {
        return block.chainid == 1;
    }

    /**
     * @dev Check if currently on Sepolia testnet
     * @return bool True if the current chain is Sepolia
     */
    function isSepolia() internal view returns (bool) {
        return block.chainid == 11155111;
    }

    /**
     * @dev Check if currently on Arbitrum Sepolia testnet
     * @return bool True if the current chain is Arbitrum Sepolia
     */
    function isArbitrumSepolia() internal view returns (bool) {
        return block.chainid == 421614;
    }

    /**
     * @dev Check if currently on Arbitrum Sepolia testnet
     * @return bool True if the current chain is Arbitrum Sepolia
     */
    function isGarfield() internal view returns (bool) {
        return block.chainid == 48898;
    }


    /**
     * @dev Check if currently on Arbitrum Sepolia testnet
     * @return bool True if the current chain is Arbitrum Sepolia
     */
    function isFlow() internal view returns (bool) {
        return block.chainid == 545;
    }

    /**
     * @dev Check if currently on local Anvil network
     * @return bool True if the current chain is Anvil
     */
    function isAnvil() internal view returns (bool) {
        return block.chainid == 31337;
    }

    /**
     * @dev Get current network name based on chain ID
     * @return string Memory containing the network name
     */
    function getNetworkName() internal view returns (string memory) {
        if (isMainnet()) return "mainnet";
        if (isSepolia()) return "sepolia";
        if (isArbitrumSepolia()) return "arbitrumSepolia";
        if (isAnvil()) return "anvil";
        if (isGarfield()) return "garfield";
        if (isFlow()) return "flow";

        // Fallback to env variable or default to current chain ID as string
        return vm.envOr("NETWORK", string(abi.encodePacked(block.chainid)));
    }

    // ======== DEPLOYMENT STAGE FUNCTIONS ========

    /**
     * @dev Helper function to check if a string starts with a prefix
     * @param str The string to check
     * @param prefix The prefix to look for
     * @return bool True if the string starts with the prefix
     */
    function startsWith(string memory str, string memory prefix) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory prefixBytes = bytes(prefix);

        if (strBytes.length < prefixBytes.length) {
            return false;
        }

        for (uint i = 0; i < prefixBytes.length; i++) {
            if (strBytes[i] != prefixBytes[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @dev Helper function to extract a substring
     * @param str The source string
     * @param startIndex The starting index (inclusive)
     * @param endIndex The ending index (exclusive)
     * @return string Memory containing the substring
     */
    function substring(string memory str, uint startIndex, uint endIndex) internal pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    /**
     * @dev Get the deployment stage (develop, staging, prod)
     * @notice Tries to detect from git branch first, then falls back to env var
     * @return string Memory containing the deployment stage
     */
    function getDeploymentStage() internal returns (string memory) {
        string memory stage;

        // Try to determine stage from git branch first
        string[] memory gitCommand = new string[](4);
        gitCommand[0] = "git";
        gitCommand[1] = "rev-parse";
        gitCommand[2] = "--abbrev-ref";
        gitCommand[3] = "HEAD";

        try vm.ffi(gitCommand) returns (bytes memory result) {
            string memory gitBranch = string(result);

            // Remove trailing newline if present
            if (bytes(gitBranch).length > 0 && bytes(gitBranch)[bytes(gitBranch).length - 1] == 0x0A) {
                gitBranch = substring(gitBranch, 0, bytes(gitBranch).length - 1);
            }

            // Map branch to stage
            if (keccak256(bytes(gitBranch)) == keccak256(bytes("main"))) {
                stage = "prod";
            } else if (keccak256(bytes(gitBranch)) == keccak256(bytes("develop"))) {
                stage = "develop";
            } else if (startsWith(gitBranch, "release/")) {
                stage = "staging";
            } else {
                // If branch name doesn't match, fall back to env variable
                stage = vm.envOr("STAGE", string("develop"));
            }
        } catch {
            // If git command fails, use environment variable with fallback
            stage = vm.envOr("STAGE", string("develop"));
        }

        // Override stage based on chain if needed
        if (isMainnet()) {
            stage = "prod";
        } else if (isAnvil()) {
            stage = "local";
        }

        console.log("Deployment stage:", stage);
        return stage;
    }

    // ======== CONFIGURATION FUNCTIONS ========

    /**
     * @dev Load configuration for deployment
     * @param network The network to load configuration for
     * @return string Memory containing the configuration JSON string
     * @return bool Indicating if configuration was found
     */
    function loadConfig(string memory network) internal returns (string memory, bool) {
        string memory configJson;
        bool configFound = false;

        try vm.readFile(CONFIG_PATH) returns (string memory json) {
            configJson = json;
            configFound = true;
            console.log("Loaded configuration from:", CONFIG_PATH);
        } catch {
            console.log("No configuration file found at:", CONFIG_PATH);
            configJson = "{}";
        }

        return (configJson, configFound);
    }

    /**
     * @dev Get a configuration value as uint256 with a default fallback
     * @param configJson The configuration JSON string
     * @param network The network to get the parameter for
     * @param key The parameter key
     * @param defaultValue The default value if parameter is not found
     * @return uint256 The parameter value
     */
    function getConfigUint(
        string memory configJson,
        string memory network,
        string memory key,
        uint256 defaultValue
    ) internal returns (uint256) {
        string memory path = string.concat(".", network, ".", key);
        try vm.parseJsonUint(configJson, path) returns (uint256 value) {
            console.log("Loaded %s from config: %d", key, value);
            return value;
        } catch {
            console.log("Warning: Could not find %s in config for network %s, using default: %d", key, network, defaultValue);
            return defaultValue;
        }
    }

    /**
     * @dev Get a configuration value as string with a default fallback
     * @param configJson The configuration JSON string
     * @param network The network to get the parameter for
     * @param key The parameter key
     * @param defaultValue The default value if parameter is not found
     * @return string Memory containing the parameter value
     */
    function getConfigString(
        string memory configJson,
        string memory network,
        string memory key,
        string memory defaultValue
    ) internal returns (string memory) {
        string memory path = string.concat(".", network, ".", key);
        try vm.parseJson(configJson, path) returns (bytes memory data) {
            string memory value = string(data);
            console.log("Loaded %s from config: %s", key, value);
            return value;
        } catch {
            console.log("Warning: Could not find %s in config for network %s, using default: %s", key, network, defaultValue);
            return defaultValue;
        }
    }

    /**
     * @dev Get a configuration value as boolean with a default fallback
     * @param configJson The configuration JSON string
     * @param network The network to get the parameter for
     * @param key The parameter key
     * @param defaultValue The default value if parameter is not found
     * @return bool The parameter value
     */
    function getConfigBool(
        string memory configJson,
        string memory network,
        string memory key,
        bool defaultValue
    ) internal returns (bool) {
        string memory path = string.concat(".", network, ".", key);
        try vm.parseJsonBool(configJson, path) returns (bool value) {
            console.log("Loaded %s from config: %s", key, value ? "true" : "false");
            return value;
        } catch {
            console.log("Warning: Could not find %s in config for network %s, using default: %s", key, network, defaultValue ? "true" : "false");
            return defaultValue;
        }
    }

    /**
     * @dev Get a configuration array with a default fallback
     * @param configJson The configuration JSON string
     * @param network The network to get the parameter for
     * @param key The parameter key
     * @return bytes Memory containing the array data
     * @return bool Indicating if the array was found
     */
    function getConfigArray(
        string memory configJson,
        string memory network,
        string memory key
    ) internal returns (bytes memory, bool) {
        string memory path = string.concat(".", network, ".", key);
        try vm.parseJson(configJson, path) returns (bytes memory data) {
            console.log("Loaded %s array from config", key);
            return (data, true);
        } catch {
            console.log("Warning: Could not find %s array in config for network %s", key, network);
            return (bytes(""), false);
        }
    }

    /**
     * @dev Get a generic parameter from the config file
     * @param configJson The configuration JSON string
     * @param network The network to get the parameter for
     * @param key The parameter key
     * @param defaultValue The default value if parameter is not found
     * @return string Memory containing the parameter value
     */
    function getConfigParam(
        string memory configJson,
        string memory network,
        string memory key,
        string memory defaultValue
    ) internal returns (string memory) {
        string memory path = string.concat(".", network, ".", key);
        try vm.parseJson(configJson, path) returns (bytes memory data) {
            return string(data);
        } catch {
            return defaultValue;
        }
    }

    /**
     * @dev Get an address parameter from the config file
     * @param configJson The configuration JSON string
     * @param network The network to get the parameter for
     * @param key The parameter key
     * @param defaultValue The default address if parameter is not found
     * @return address The parameter value
     */
    function getConfigAddress(
        string memory configJson,
        string memory network,
        string memory key,
        address defaultValue
    ) internal returns (address) {
        string memory path = string.concat(".", network, ".", key);

        try vm.parseJson(configJson, path) returns (bytes memory data) {
            // Check if it's likely an address (20 bytes)
            if (data.length == 20) {
                address addr;
                assembly {
                    addr := mload(add(data, 32))
                }
                console.log("Successfully parsed address from config: %s", addr);
                return addr;
            } else {
                try vm.parseJsonAddress(configJson, path) returns (address addr) {
                    console.log("Successfully parsed address using parseJsonAddress: %s", addr);
                    return addr;
                } catch {
                    console.log("Warning: Failed to parse address for %s, using default", key);
                    return defaultValue;
                }
            }
        } catch {
            console.log("Warning: Could not find %s in config for network %s, using default", key, network);
            return defaultValue;
        }
    }

    // ======== CONTRACT ARTIFACT FUNCTIONS ========

    /**
     * @dev Get paths for all contract deployment artifacts
     * @param stage The deployment stage (develop, staging, prod, etc.)
     * @return implPath Path to implementation addresses JSON
     * @return proxyPath Path to proxy addresses JSON
     * @return abiPath Path to contract ABIs JSON
     */
    function getDeploymentPaths(string memory stage) internal pure returns (
        string memory implPath,
        string memory proxyPath,
        string memory abiPath
    ) {
        implPath = string.concat(DEPLOYMENTS_DIR, "/", stage, "-contract-addresses.json");
        proxyPath = string.concat(DEPLOYMENTS_DIR, "/", stage, "-contract-proxies.json");
        abiPath = string.concat(DEPLOYMENTS_DIR, "/", stage, "-contract-abis.json");
        return (implPath, proxyPath, abiPath);
    }

    /**
     * @dev Load saved contract addresses from JSON file
     * @param filePath The path to the JSON file
     * @return string Memory containing the JSON content as string
     */
    function loadAddressFile(string memory filePath) internal returns (string memory) {
        string memory jsonContent;
        try vm.readFile(filePath) returns (string memory json) {
            jsonContent = json;
            console.log("Loaded addresses from: %s", filePath);
        } catch {
            revert(string.concat("BaseScript::loadAddressFile: File not found: ", filePath));
        }
        return jsonContent;
    }

    /**
     * @dev Get contract address from JSON file
     * @param jsonContent The JSON content
     * @param network The network to get the address for
     * @param contractName The contract name
     * @return address The contract address
     */
    function getContractAddress(
        string memory jsonContent,
        string memory network,
        string memory contractName
    ) internal returns (address) {
        address contractAddress;
        string memory path = string.concat(".", network, ".", contractName);
        try vm.parseJsonAddress(jsonContent, path) returns (address addr) {
            contractAddress = addr;
            console.log("Found %s address: %s", contractName, contractAddress);
        } catch {
            revert(string.concat("BaseScript::getContractAddress: Address not found for ", contractName, " on ", network));
        }
        return contractAddress;
    }

    // ======== CONTRACT SAVING FUNCTIONS ========

    /**
     * @dev Save contract address to JSON file
     * @notice This function properly handles creating or updating JSON files
     * @param filePath The path to the JSON file
     * @param network The network to save the address for
     * @param contractName The contract name
     * @param contractAddress The contract address
     */
    function saveContractAddress(
        string memory filePath,
        string memory network,
        string memory contractName,
        address contractAddress
    ) internal {
        // Step 1: Check if file exists and read its content
        string memory existingJson = "{}";
        bool fileExists = false;

        try vm.readFile(filePath) returns (string memory content) {
            if (bytes(content).length > 0) {
                existingJson = content;
                fileExists = true;
            }
        } catch {
            // File doesn't exist, we'll create it
        }

        // Step 2: Create a temporary JSON object for our contract
        string memory jsonFile = string.concat(filePath, ".tmp.json");
        string memory jsFile = string.concat(filePath, ".update.js");

        // Write the current contract address to a temporary file
        string memory contractJson = string(abi.encodePacked(
                "{\"", contractName, "\":\"", vm.toString(contractAddress), "\"}"
            ));
        vm.writeFile(jsonFile, contractJson);

        // Step 3: Create a JavaScript file to handle the JSON merging properly
        string memory jsContent = string(abi.encodePacked(
                "const fs = require('fs');\n",
                "// Read the original file if it exists\n",
                "let data = {};\n",
                "try {\n",
                "  if (fs.existsSync('", filePath, "')) {\n",
                "    const fileContent = fs.readFileSync('", filePath, "', 'utf8');\n",
                "    if (fileContent.trim().length > 0) {\n",
                "      data = JSON.parse(fileContent);\n",
                "    }\n",
                "  }\n",
                "} catch (err) {\n",
                "  console.error('Error reading original file:', err);\n",
                "}\n\n",
                "// Read the contract data\n",
                "let contractData = {};\n",
                "try {\n",
                "  const contractContent = fs.readFileSync('", jsonFile, "', 'utf8');\n",
                "  contractData = JSON.parse(contractContent);\n",
                "} catch (err) {\n",
                "  console.error('Error reading contract file:', err);\n",
                "  process.exit(1);\n",
                "}\n\n",
                "// Create network if it doesn't exist\n",
                "if (!data['", network, "']) {\n",
                "  data['", network, "'] = {};\n",
                "}\n\n",
                "// Add or update the contract in the network\n",
                "data['", network, "']['", contractName, "'] = contractData['", contractName, "'];\n\n",
                "// Write the result back to the file with pretty formatting\n",
                "fs.writeFileSync('", filePath, "', JSON.stringify(data, null, 2));\n\n",
                "// Clean up the temporary file\n",
                "try {\n",
                "  fs.unlinkSync('", jsonFile, "');\n",
                "} catch (err) {}\n"
            ));
        vm.writeFile(jsFile, jsContent);

        // Step 4: Execute the JavaScript file using node
        string[] memory cmd = new string[](3);
        cmd[0] = "node";
        cmd[1] = jsFile;
        cmd[2] = "2>/dev/null";  // Redirect stderr to null

        try vm.ffi(cmd) {
            console.log("Successfully saved %s address to %s: %s", contractName, filePath, contractAddress);
        } catch {
            // JavaScript execution failed, fall back to a simple approach
            console.log("External script failed, using fallback method");

            // Create a simple JSON with proper formatting
            string memory simpleJson = string(abi.encodePacked(
                    "{\n",
                    "  \"", network, "\": {\n",
                    "    \"", contractName, "\": \"", vm.toString(contractAddress), "\"\n",
                    "  }\n",
                    "}"
                ));

            vm.writeFile(filePath, simpleJson);
            console.log("Created simple JSON for %s with %s address: %s", network, contractName, contractAddress);
        }

        // Clean up temporary files
        try vm.removeFile(jsFile) {} catch {}
        try vm.removeFile(jsonFile) {} catch {}
    }

    /**
     * @dev Save contract ABI to JSON file
     * @notice This function extracts just the ABI from the metadata and properly handles JSON merging
     * @param filePath The path to the JSON file
     * @param network The network to save the ABI for
     * @param contractName The contract name
     */
    function saveContractABI(
        string memory filePath,
        string memory network,
        string memory contractName
    ) internal {
        // Step 1: Find the ABI JSON file
        string memory abiJsonPath = string.concat("out/", contractName, ".sol/", contractName, ".json");

        try vm.readFile(abiJsonPath) returns (string memory json) {
            // Step 2: Create temporary files for processing
            string memory tempAbiFile = string.concat(filePath, ".abi.tmp");
            string memory jsFile = string.concat(filePath, ".abi.js");

            // Step 3: Write the ABI file to a temporary location
            vm.writeFile(tempAbiFile, json);

            // Step 4: Create a JavaScript file to extract the ABI and handle the merging
            string memory jsContent = string(abi.encodePacked(
                    "const fs = require('fs');\n",
                    "// Read the contract metadata JSON\n",
                    "let metadata = {};\n",
                    "try {\n",
                    "  const metadataContent = fs.readFileSync('", tempAbiFile, "', 'utf8');\n",
                    "  metadata = JSON.parse(metadataContent);\n",
                    "} catch (err) {\n",
                    "  console.error('Error reading metadata file:', err);\n",
                    "  process.exit(1);\n",
                    "}\n\n",
                    "// Extract just the ABI portion\n",
                    "if (!metadata.abi) {\n",
                    "  console.error('No ABI found in metadata');\n",
                    "  process.exit(1);\n",
                    "}\n",
                    "const abi = metadata.abi;\n\n",
                    "// Read the existing ABI file if it exists\n",
                    "let data = {};\n",
                    "try {\n",
                    "  if (fs.existsSync('", filePath, "')) {\n",
                    "    const fileContent = fs.readFileSync('", filePath, "', 'utf8');\n",
                    "    if (fileContent.trim().length > 0) {\n",
                    "      data = JSON.parse(fileContent);\n",
                    "    }\n",
                    "  }\n",
                    "} catch (err) {\n",
                    "  console.error('Error reading existing ABI file:', err);\n",
                    "}\n\n",
                    "// Create network if it doesn't exist\n",
                    "if (!data['", network, "']) {\n",
                    "  data['", network, "'] = {};\n",
                    "}\n\n",
                    "// Create contract entry if it doesn't exist\n",
                    "if (!data['", network, "']['", contractName, "']) {\n",
                    "  data['", network, "']['", contractName, "'] = {};\n",
                    "}\n\n",
                    "// Add or update the ABI\n",
                    "data['", network, "']['", contractName, "'] = abi;\n\n",
                    "// Write the result back to the file with pretty formatting\n",
                    "fs.writeFileSync('", filePath, "', JSON.stringify(data, null, 2));\n\n",
                    "// Clean up\n",
                    "try {\n",
                    "  fs.unlinkSync('", tempAbiFile, "');\n",
                    "} catch (err) {}\n"
                ));
            vm.writeFile(jsFile, jsContent);

            // Step 5: Execute the JavaScript file
            string[] memory cmd = new string[](3);
            cmd[0] = "node";
            cmd[1] = jsFile;
            cmd[2] = "2>/dev/null";  // Redirect stderr to null

            try vm.ffi(cmd) {
                console.log("Successfully saved %s ABI to %s", contractName, filePath);
            } catch {
                // JavaScript execution failed, fall back to a simpler approach
                console.log("External script failed, using fallback method for ABI");

                // Extract just the ABI using vm.parseJson
                bytes memory abiData;
                try vm.parseJson(json, ".abi") returns (bytes memory data) {
                    abiData = data;
                } catch {
                    console.log("Failed to extract ABI from metadata");
                    return;
                }

                // Create a simple JSON with just this contract's ABI
                string memory simpleJson = string(abi.encodePacked(
                        "{\n",
                        "  \"", network, "\": {\n",
                        "    \"", contractName, "\": ", string(abiData), "\n",
                        "  }\n",
                        "}"
                    ));

                vm.writeFile(filePath, simpleJson);
                console.log("Created simple JSON for %s ABI", contractName);
            }

            // Clean up temporary files
            try vm.removeFile(jsFile) {} catch {}
            try vm.removeFile(tempAbiFile) {} catch {}
        } catch {
            console.log("Warning: Could not find metadata JSON for %s at %s", contractName, abiJsonPath);
        }
    }

    /**
     * @notice Predicts the address of a contract to be deployed using CREATE opcode
     * @dev This function can be used for any contract, not just specific ones like TimelockController
     * @param deployer The address that will deploy the contract
     * @param startingNonce The current nonce of the deployer (optional - will use current nonce if 0)
     * @param numberOfDeployments How many contracts will be deployed before the target contract
     * @return The predicted contract address
     */
    function predictDeployedAddress(
        address deployer,
        uint256 startingNonce,
        uint256 numberOfDeployments
    ) public view returns (address) {
        // If starting nonce is 0, get the current nonce of the deployer
        uint256 nonce = startingNonce == 0
        ? vm.getNonce(deployer)
        : startingNonce;

        // Add the number of deployments to the nonce
        nonce += numberOfDeployments;

        // Calculate the address using Foundry's built-in function
        return vm.computeCreateAddress(deployer, nonce);
    }
}