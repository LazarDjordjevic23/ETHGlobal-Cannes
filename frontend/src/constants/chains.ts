import {
  flowTestnet,
  sepolia,
  zircuitGarfieldTestnet,
  mantleSepoliaTestnet,
} from "viem/chains";

const sepoliaConfig = {
  chainId: sepolia.id,
  networkId: sepolia.id,
  name: sepolia.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
  nativeCurrency: sepolia.nativeCurrency,
  rpcUrls: [sepolia.rpcUrls.default.http[0]],
  blockExplorerUrls: [sepolia.blockExplorers.default.url],
};

const zircuitGarfieldTestnetConfig = {
  chainId: zircuitGarfieldTestnet.id,
  networkId: zircuitGarfieldTestnet.id,
  name: zircuitGarfieldTestnet.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
  nativeCurrency: zircuitGarfieldTestnet.nativeCurrency,
  rpcUrls: [zircuitGarfieldTestnet.rpcUrls.default.http[0]],
  blockExplorerUrls: [zircuitGarfieldTestnet.blockExplorers.default.url],
};

const flowTestnetConfig = {
  chainId: flowTestnet.id,
  networkId: flowTestnet.id,
  name: flowTestnet.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
  nativeCurrency: flowTestnet.nativeCurrency,
  rpcUrls: [flowTestnet.rpcUrls.default.http[0]],
  blockExplorerUrls: [flowTestnet.blockExplorers.default.url],
};

const mentholTestnetConfig = {
  chainId: mantleSepoliaTestnet.id,
  networkId: mantleSepoliaTestnet.id,
  name: mantleSepoliaTestnet.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
  nativeCurrency: mantleSepoliaTestnet.nativeCurrency,
  rpcUrls: [mantleSepoliaTestnet.rpcUrls.default.http[0]],
  blockExplorerUrls: [mantleSepoliaTestnet.blockExplorers.default.url],
};

export const evmNetworks = [
  sepoliaConfig,
  zircuitGarfieldTestnetConfig,
  flowTestnetConfig,
  mentholTestnetConfig,
];

export type AvailableChainId = 11155111 | 48898 | 545 | 5003;

export const availableChains = [
  sepolia,
  zircuitGarfieldTestnet,
  flowTestnet,
  mantleSepoliaTestnet,
];

export const getChainByChainId = (chainId: AvailableChainId) => {
  return availableChains.find((chain) => chain.id === chainId) || sepolia;
};

export const getRpcUrlByChainId = (chainId: AvailableChainId) => {
  return availableChains.find((chain) => chain.id === chainId)?.rpcUrls[0];
};
