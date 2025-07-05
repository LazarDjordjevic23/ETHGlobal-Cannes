import { sepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const wagminConfig = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
  },
});
