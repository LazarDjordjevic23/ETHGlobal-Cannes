import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { evmNetworks } from "@/constants/chains";
import { wagminConfig } from "@/constants/wagmi";
import { AgentProvider } from "@/components/AgentProvider";

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "385f45f4-6499-4335-a3dd-b39b3d9a2026",
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks,
        },
      }}
    >
      <WagmiProvider config={wagminConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <AgentProvider>{children}</AgentProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
