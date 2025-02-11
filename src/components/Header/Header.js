// src/components/Header/Header.js
import React, { useState } from 'react';
import './Header.scss'; // Import the SCSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icon for profile

const Header = ({ account, onDisconnect, onConnect }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showWalletSelector, setShowWalletSelector] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDisconnect = () => {
    onDisconnect();
    setDropdownOpen(false);
  };

  const handleWalletConnect = (walletType) => {
    onConnect(walletType); // This will now call the `handleConnect` method passed from App.js
    setShowWalletSelector(false); // Close the wallet selector after selection
  };
  

  return (
    <header className="header">
      <div className="logo">YourLogo</div>
      <div className="portfolio">
        {account ? (
          <>
            <div className="wallet-info">
              <span>{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
            </div>
            <div className="profile-icon" onClick={toggleDropdown}>
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleDisconnect}>Disconnect Wallet</button>
              </div>
            )}
          </>
        ) : (
          <button onClick={() => setShowWalletSelector(true)}>Connect Wallet</button>
        )}
      </div>

      {/* Wallet Selector Popup */}
      {showWalletSelector && !account && (
        <div className="wallet-selector">
          <button onClick={() => handleWalletConnect('argent')}>Connect to Argent</button>
          <button onClick={() => handleWalletConnect('braavos')}>Connect to Braavos</button>
        </div>
      )}
    </header>
  );
};

export default Header;
