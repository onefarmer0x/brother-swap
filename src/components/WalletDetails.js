// src/components/WalletDetails.js
import React from 'react';

const WalletDetails = ({ account, onDisconnect }) => {
  // Show only the last 6 characters of the wallet address
  const displayAddress = account ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : '';

  return (
    <div>
      <p>Connected Wallet: {displayAddress}</p>
      <button onClick={onDisconnect}>Disconnect Wallet</button>
    </div>
  );
};

export default WalletDetails;  // Make sure you are using `export default`
