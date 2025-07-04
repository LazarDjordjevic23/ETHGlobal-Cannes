import { arbitrum, arbitrumSepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const wagminConfig = createConfig({
  chains: [arbitrum, arbitrumSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [arbitrumSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});
