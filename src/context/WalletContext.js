import React, { createContext, useState, useEffect } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Check localStorage for existing session
    const savedAccount = localStorage.getItem("walletAddress");
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  // Detects StarkNet wallet
  const detectWallet = () => {
    if (typeof window !== "undefined") {
      return window.starknet_braavos || window.starknet_argentX || null;
    }
    return null;
  };

  // Connects the wallet
  const connectWallet = async () => {
    const detectedWallet = detectWallet();
    if (!detectedWallet) {
      alert("No StarkNet wallet found. Install Braavos or Argent X.");
      return;
    }

    try {
      await detectedWallet.enable();
      const walletAddress = detectedWallet.selectedAddress;
      setWallet(detectedWallet);
      setAccount(walletAddress);
      localStorage.setItem("walletAddress", walletAddress);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Disconnect the wallet
  const disconnectWallet = () => {
    setWallet(null);
    setAccount(null);
    localStorage.removeItem("walletAddress");
    window.dispatchEvent(new Event("walletDisconnected")); // 🚀 Force global update
  };

  return (
    <WalletContext.Provider value={{ wallet, account, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
