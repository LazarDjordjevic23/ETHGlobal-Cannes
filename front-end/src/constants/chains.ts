import { arbitrum, arbitrumSepolia } from "viem/chains";

const arbitrumOneConfig = {
  chainId: arbitrum.id,
  networkId: arbitrum.id,
  name: arbitrum.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/arbitrum.svg"],
  nativeCurrency: arbitrum.nativeCurrency,
  rpcUrls: ["https://arb1.arbitrum.io/rpc"], // need to add our custom RPC for Traia
  blockExplorerUrls: [arbitrum.blockExplorers.default.url],
};

const arbitrumSepoliaConfig = {
  chainId: arbitrumSepolia.id,
  networkId: arbitrumSepolia.id,
  name: arbitrumSepolia.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/arbitrum.svg"],
  nativeCurrency: arbitrumSepolia.nativeCurrency,
  rpcUrls: [
    "https://arbitrum-sepolia.core.chainstack.com/873cbc1f5ef0abc2cb778e1693c7c002", // this is hord RPC, should change to our custom RPC for Traia
  ],
  blockExplorerUrls: [arbitrumSepolia.blockExplorers.default.url],
};

export const evmNetworks = [arbitrumOneConfig, arbitrumSepoliaConfig];

export const getRpcUrlByChainId = (chainId: number) => {
  return evmNetworks.find((chain) => chain.chainId === chainId)?.rpcUrls[0];
};
