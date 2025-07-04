import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { evmNetworks } from "@/constants/chains";
import { wagminConfig } from "@/constants/wagmi";

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "06349a78-d5be-4680-adb8-6a6e3326a1ab",
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks,
        },
      }}
    >
      <WagmiProvider config={wagminConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
