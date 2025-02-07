// src/App.js
import React, { useState } from 'react';
import WalletConnector from './components/WalletConnector';
import TokenSelector from './components/TokenSelector';
import TokenSwap from './components/TokenSwap';
import WalletDetails from './components/WalletDetails';  // Default import
import useTokens from './hooks/useTokens';

function App() {
  const { tokens, tokenSize } = useTokens();
  const [account, setAccount] = useState(null);
  const [selectedToken, setSelectedToken] = useState('');

  // Handle wallet disconnection
  const handleDisconnect = () => {
    setAccount(null);
  };

  return (
    <div>
      {!account ? (
        <WalletConnector setAccount={setAccount} />
      ) : (
        <>
          <WalletDetails account={account} onDisconnect={handleDisconnect} /> {/* Display wallet details */}
          <TokenSelector tokens={tokens} selectedToken={selectedToken} onSelect={setSelectedToken} />
          <TokenSwap account={account} tokens={tokens} />
          <p>{tokenSize} Verified tokens available</p>
        </>
      )}
    </div>
  );
}

export default App;
