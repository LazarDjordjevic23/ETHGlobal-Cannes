import { motion } from "framer-motion";

interface ProposalDetailsProps {
  details: string;
}

const ProposalDetails = ({ details }: ProposalDetailsProps) => {
  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">Proposal Details</h3>
      <div className="prose prose-sm max-w-none">
        <pre className="whitespace-pre-wrap break-words text-gray-700 ">
          {details}
        </pre>
      </div>
    </motion.div>
  );
};

export default ProposalDetails;
