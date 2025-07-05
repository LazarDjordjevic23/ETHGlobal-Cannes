import { motion } from "framer-motion";

interface BackButtonProps {
  onClick: () => void;
  text?: string;
}

const BackButton = ({
  onClick,
  text = "Back to Proposals",
}: BackButtonProps) => {
  return (
    <motion.div
      className="mb-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={onClick}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {text}
      </button>
    </motion.div>
  );
};

export default BackButton;
