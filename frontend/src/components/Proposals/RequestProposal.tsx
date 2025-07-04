import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";

interface Message {
  id: string;
  type: "user" | "agent";
  content: string;
  timestamp: Date;
  proposalLink?: string;
}

const RequestProposal = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content:
        "Hello! I'm your AI governance agent. I can help you create proposals for your DAO. What would you like to propose?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content:
          "I've analyzed your request and created a comprehensive proposal. Based on your input, I've drafted a proposal that addresses the key points while considering the DAO's current treasury status, governance structure, and community needs.",
        timestamp: new Date(),
        proposalLink: `proposal-${Date.now()}`,
      };

      setMessages((prev) => [...prev, agentResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleViewProposal = (proposalId: string) => {
    // Navigate to the proposal detail page
    navigate(`/proposal/${proposalId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Request Proposal
        </h2>
        <p className="text-gray-600">
          Ask your AI agent to create a proposal for your DAO
        </p>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        className="bg-white rounded-lg border border-gray-200 shadow-sm h-96 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.type === "agent" && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🤖</span>
                    <span className="text-xs font-medium text-gray-600">
                      AI Agent
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                {message.proposalLink && (
                  <motion.button
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewProposal(message.proposalLink!)}
                  >
                    View Created Proposal →
                  </motion.button>
                )}

                <div className="text-xs mt-1 opacity-75">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🤖</span>
                  <span className="text-xs font-medium text-gray-600">
                    AI Agent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Analyzing your request...
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you'd like to propose to your DAO..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Example Prompts */}
      <motion.div
        className="bg-gray-50 rounded-lg p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Example Requests
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: "Treasury Optimization",
              description:
                "Suggest ways to optimize our treasury for better yields",
              prompt:
                "Our treasury has $2.4M sitting idle. Can you propose a strategy to optimize yield while maintaining security?",
            },
            {
              title: "Community Incentives",
              description: "Create incentive programs for active members",
              prompt:
                "We need to increase governance participation. Can you propose an incentive program for active voters?",
            },
            {
              title: "Protocol Upgrades",
              description: "Propose technical improvements to our protocol",
              prompt:
                "Our gas costs are too high. Can you propose a multi-chain deployment strategy?",
            },
            {
              title: "Partnership Proposals",
              description: "Suggest strategic partnerships",
              prompt:
                "We should partner with other DAOs. Can you propose a collaboration framework?",
            },
          ].map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setInputValue(example.prompt)}
              className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h4 className="font-medium text-gray-900 mb-1">
                {example.title}
              </h4>
              <p className="text-sm text-gray-600">{example.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RequestProposal;
