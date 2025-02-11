// src/components/WalletDetails.js
import React from 'react';

const WalletDetails = ({ account, onDisconnect }) => {
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div>
      <h3>Connected Wallet:</h3>
      <p>{truncateAddress(account.address)}</p>
      <button onClick={onDisconnect}>Disconnect Wallet</button>
    </div>
  );
};

export default WalletDetails;
