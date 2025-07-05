import { createContext, useContext } from "react";
import type { Agent } from "@/types/agent";

interface AgentContextType {
  selectedAgent: Agent | null;
  setSelectedAgent: (agent: Agent | null) => void;
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
