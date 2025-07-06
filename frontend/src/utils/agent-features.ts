import type { Agent } from "@/types/agent";

const defaultFeatures = [
  {
    icon: "💰",
    title: "Treasury Analysis",
    description: "Current holdings, yield opportunities, and liquidity needs",
  },
  {
    icon: "🗳️",
    title: "Governance Health",
    description: "Participation rates, voting patterns, and engagement metrics",
  },
  {
    icon: "👥",
    title: "Community Needs",
    description: "Member feedback, growth opportunities, and pain points",
  },
  {
    icon: "🔧",
    title: "Technical State",
    description: "Protocol performance, upgrades needed, and security status",
  },
];

const distractiveFeatures = [
  {
    icon: "😈",
    title: "Meme Potential",
    description:
      "Viral content opportunities and community engagement through humor",
  },
  {
    icon: "🎲",
    title: "Chaos Theory",
    description: "Random market movements and unpredictable opportunities",
  },
  {
    icon: "🍕",
    title: "Comfort Breaks",
    description: "Optimal timing for pizza breaks and cat video sessions",
  },
  {
    icon: "✨",
    title: "Shiny Objects",
    description: "New trending tokens and whatever catches our attention",
  },
];

const communistFeatures = [
  {
    icon: "🤝",
    title: "Collective Ownership",
    description: "Shared treasury management and community-owned assets",
  },
  {
    icon: "⚖️",
    title: "Wealth Distribution",
    description: "Fair allocation of resources and equal opportunity access",
  },
  {
    icon: "🏛️",
    title: "Democratic Governance",
    description: "Community consensus and collective decision-making processes",
  },
  {
    icon: "🌍",
    title: "Social Impact",
    description: "Projects that benefit the greater good and community welfare",
  },
];

const capitalistFeatures = [
  {
    icon: "💵",
    title: "Diamond Hands",
    description: "Long-term HODL strategies and conviction-based investing",
  },
  {
    icon: "🚀",
    title: "Moon Missions",
    description: "High-growth potential and exponential return opportunities",
  },
  {
    icon: "📈",
    title: "Number Go Up",
    description: "Maximum profit optimization and aggressive growth targets",
  },
  {
    icon: "🔥",
    title: "YOLO Energy",
    description: "High-risk, high-reward plays and market domination",
  },
];

export const getAgentFeatures = (agent: Agent | null) => {
  if (!agent) {
    return defaultFeatures;
  }

  switch (agent.id) {
    case 1:
      return distractiveFeatures;

    case 2:
      return communistFeatures;

    case 3:
      return capitalistFeatures;

    default:
      return defaultFeatures;
  }
};
