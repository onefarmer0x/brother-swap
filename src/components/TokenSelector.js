// src/components/TokenSelector.js
import React from 'react';

const TokenSelector = ({ tokens, selectedToken, onSelect }) => {
  return (
    <select value={selectedToken} onChange={(e) => onSelect(e.target.value)}>
      <option value="">Select a token</option>
      {tokens.map((token) => (
        <option key={token.address} value={token.address}>
          {token.symbol} - {token.name}
        </option>
      ))}
    </select>
  );
};

export default TokenSelector;
