import React, { useState } from 'react';

const ConnectWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);

  // Detects the wallet in the browser (Braavos first, then Argent X)
  const detectWallet = () => {
    if (typeof window !== 'undefined') {
      if (window.starknet_braavos) return window.starknet_braavos;
      if (window.starknet_argentX) return window.starknet_argentX;
    }
    return null;
  };

  // Handles wallet connection
  const connectWallet = async () => {
    const detectedWallet = detectWallet();
    if (!detectedWallet) {
      alert('No StarkNet wallet found. Please install Braavos or Argent X.');
      return;
    }

    try {
      // Request wallet connection (permission)
      await detectedWallet.enable();
      setWallet(detectedWallet);
      setAccount(detectedWallet.selectedAddress);
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  // Disconnect clears our local connection state
  const disconnectWallet = () => {
    setWallet(null);
    setAccount(null);
  };

  return (
    <div style={{ margin: '20px' }}>
      {wallet ? (
        <div>
          <p>Wallet connected!</p>
          <p><strong>Address:</strong> {account}</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
};

export default ConnectWallet;
