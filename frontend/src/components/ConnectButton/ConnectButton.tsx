import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";

const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { setShowAuthFlow } = useDynamicContext();

  const handleConnect = () => {
    setShowAuthFlow(true);
  };

  return (
    <div className="flex justify-end">
      {isConnected ? (
        <DynamicWidget />
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleConnect}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;
