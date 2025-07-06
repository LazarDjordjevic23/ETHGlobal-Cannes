import { useState } from "react";
import type { ReactNode } from "react";
import type { Agent } from "@/types/agent";
import { AgentContext, type ProposalResponse } from "@/contexts/agent-context";

interface AgentProviderProps {
  children: ReactNode;
}

export const AgentProvider = ({ children }: AgentProviderProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>({
    id: 3,
    name: "Capitalist Agent 💵",
    description:
      "📈🏦 Resources must flow to those who deliver the most value, driving growth through efficiency and competition 💼🔥.",
    status: "Pumping",
    strategy: "Moon Mission 🚀",
    risk: "YOLO",
  });

  const [proposalData, setProposalData] = useState<ProposalResponse | null>(
    null
  );

  return (
    <AgentContext.Provider
      value={{
        selectedAgent,
        setSelectedAgent,
        proposalData,
        setProposalData,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};
