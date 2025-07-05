import { sepolia, zircuitGarfieldTestnet, flowTestnet } from "viem/chains";
import { createConfig, http } from "wagmi";

export const wagminConfig = createConfig({
  chains: [sepolia, zircuitGarfieldTestnet, flowTestnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
    [zircuitGarfieldTestnet.id]: http(),
    [flowTestnet.id]: http(),
  },
});
