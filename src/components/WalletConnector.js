import React, { useEffect } from 'react';
import { connect, disconnect } from 'get-starknet';  // assuming disconnect is available

const WalletConnector = ({ setAccount }) => {
  
  useEffect(() => {
    // Disconnect the previous wallet session on mount (if supported)
    disconnect(); // Only use if `get-starknet` provides this method

    return () => {
      // Optional: Disconnect when the component unmounts, in case
      disconnect();
    };
  }, []);

  const handleConnect = async () => {
    try {
      const starknet = await connect();
      if (!starknet) return;
      await starknet.enable();

      if (starknet.isConnected && starknet.provider && starknet.account.address) {
        setAccount(starknet.account);
      }
    } catch (error) {
      console.error("Error connecting wallet", error);
    }
  };

  return <button onClick={handleConnect}>Connect Wallet</button>;
};

export default WalletConnector;
