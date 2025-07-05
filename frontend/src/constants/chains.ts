import { sepolia } from "viem/chains";

const sepoliaConfig = {
  chainId: sepolia.id,
  networkId: sepolia.id,
  name: sepolia.name,
  iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
  nativeCurrency: sepolia.nativeCurrency,
  rpcUrls: [sepolia.rpcUrls.default.http[0]],
  blockExplorerUrls: [sepolia.blockExplorers.default.url],
};

export const evmNetworks = [sepoliaConfig];

export const getRpcUrlByChainId = (chainId: number) => {
  return evmNetworks.find((chain) => chain.chainId === chainId)?.rpcUrls[0];
};
