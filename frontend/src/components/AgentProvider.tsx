import { useState } from "react";
import type { ReactNode } from "react";
import type { Agent } from "@/types/agent";
import { AgentContext } from "@/contexts/agent-context";

interface AgentProviderProps {
  children: ReactNode;
}

export const AgentProvider = ({ children }: AgentProviderProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <AgentContext.Provider value={{ selectedAgent, setSelectedAgent }}>
      {children}
    </AgentContext.Provider>
  );
};
