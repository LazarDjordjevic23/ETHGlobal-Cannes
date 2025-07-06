import { createContext, useContext } from "react";
import type { Agent } from "@/types/agent";

interface ProposalResponse {
  timestamp: string;
  tx_url: string;
  strategy_id: number;
  reasoning: string;
  ai_analysis: {
    final_output: string;
    strategy_recommendation: {
      strategy_id: number;
      reasoning: string;
      expected_profit: string;
    };
  };
  tx_hash?: string;
  txHash?: string;
}

interface AgentContextType {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
  proposalData: ProposalResponse | null;
  setProposalData: (data: ProposalResponse | null) => void;
}

export const AgentContext = createContext<AgentContextType | undefined>(
  undefined
);

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};

export type { ProposalResponse };
