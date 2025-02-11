import React, { useState, useEffect } from 'react';
import WalletConnector from './components/WalletConnector';
import TokenSelector from './components/TokenSelector/TokenSelector';
import TokenSwap from './components/TokenSwap';
import SwapCard from './components/SwapCard/SwapCard';
import WalletDetails from './components/WalletDetails';
import useTokens from './hooks/useTokens';
import './App.scss';
import Header from './components/Header/Header'; // Import the Header component
import "./fontawesome"; // This ensures the icons are available globally

function App() {
  const { tokens, tokenSize } = useTokens();
  const [account, setAccount] = useState(null); // Store the connected account
  const [selectedToken, setSelectedToken] = useState('');
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!account) {
      setShowWalletSelector(false);
    }
  }, [account]);

  const handleConnect = async (walletType) => {
    setShowWalletSelector(false);

    try {
      if (walletType === 'argent') {
        const argentAccount = await connectToArgent();
        setAccount(argentAccount);
      } else if (walletType === 'braavos') {
        const braavosAccount = await connectToBraavos();
        setAccount(braavosAccount);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      alert("Connection failed. Please try again.");
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    setShowDropdown(false); // Close the dropdown on disconnect
  };

  return (
    <div className="app-container">
      <Header 
        account={account} 
        onDisconnect={handleDisconnect} 
        onConnect={handleConnect}  // Pass the onConnect function here
      />

      {/* Main Content */}
      <main className="main-page">

      <SwapCard/>

        {account && (
          <>
            <TokenSelector tokens={tokens} selectedToken={selectedToken} onSelect={setSelectedToken} />
            <TokenSwap account={account} tokens={tokens} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2025 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
}

async function connectToArgent() {
  if (window.argent && window.argent.connect) {
    const account = await window.argent.connect();
    return account; // Return account info
  }
  throw new Error("Argent wallet extension is not available");
}

async function connectToBraavos() {
  if (window.braavos && window.braavos.enable) {
    const account = await window.braavos.enable();
    return account; // Return account info
  }
  throw new Error("Braavos wallet extension is not available");
}

export default App;
