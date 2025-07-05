import { motion } from "framer-motion";

interface AIAgentReasoningProps {
  reasoning: string;
}

const AIAgentReasoning = ({ reasoning }: AIAgentReasoningProps) => {
  return (
    <motion.div
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">AI Agent Analysis</h3>
          <p className="text-sm text-gray-600">Why this proposal was created</p>
        </div>
      </div>
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
          {reasoning}
        </pre>
      </div>
    </motion.div>
  );
};

export default AIAgentReasoning;
