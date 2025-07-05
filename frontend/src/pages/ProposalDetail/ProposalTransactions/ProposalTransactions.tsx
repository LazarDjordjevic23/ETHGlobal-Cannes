import { motion } from "framer-motion";

interface Transaction {
  target: string;
  value: string;
  function: string;
  inputs: string;
}

interface ProposalTransactionsProps {
  transactions: Transaction[];
}

const ProposalTransactions = ({ transactions }: ProposalTransactionsProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Proposed Transactions
      </h3>
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Target:</span>
                <span className="ml-2 text-gray-600 font-mono">
                  {tx.target}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Function:</span>
                <span className="ml-2 text-gray-600">{tx.function}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Inputs:</span>
                <span className="ml-2 text-gray-600 font-mono">
                  {tx.inputs}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProposalTransactions;
