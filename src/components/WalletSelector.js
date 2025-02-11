// src/components/WalletSelector.js
import React from 'react';
import argentLogo from '../assets/argent_wallet_logo.png';  // Add Argent logo in your assets folder
import bravoLogo from '../assets/braavos_wallet_logo.webp';    // Add Bravo logo in your assets folder

const WalletSelector = ({ onSelectWallet }) => {
  return (
    <div>
      <h3>Select a Wallet</h3>
      <div>
        <button onClick={() => onSelectWallet('argent')}>
          <img src={argentLogo} alt="Argent Wallet" style={{ width: '50px', marginRight: '10px' }} />
          Argent
        </button>
      </div>
      <div>
        <button onClick={() => onSelectWallet('braavos')}>
          <img src={bravoLogo} alt="Braavos Wallet" style={{ width: '50px', marginRight: '10px' }} />
          Braavos
        </button>
      </div>
    </div>
  );
};

export default WalletSelector;
