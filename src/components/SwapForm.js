// src/components/SwapForm.js
import React, { useState } from 'react';
import { fetchQuotes, executeSwap } from '@avnu/avnu-sdk';
import TokenSelector from './TokenSelector';

const SwapForm = ({ account, tokens }) => {
  const [sellToken, setSellToken] = useState('');
  const [buyToken, setBuyToken] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [quote, setQuote] = useState(null);

  // Fetch quote for the swap
  const getQuote = async () => {
    try {
      const params = {
        sellTokenAddress: sellToken,
        buyTokenAddress: buyToken,
        sellAmount,
        takerAddress: account.address,
      };
      const quotes = await fetchQuotes(params);
      setQuote(quotes[0]);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  // Handle the swap execution
  const handleSwap = async () => {
    try {
      if (quote) {
        await executeSwap(account, quote);
        alert('Swap executed successfully!');
      }
    } catch (error) {
      console.error('Swap execution failed:', error);
    }
  };

  return (
    <div>
      <TokenSelector tokens={tokens} selectedToken={sellToken} onSelect={setSellToken} />
      <TokenSelector tokens={tokens} selectedToken={buyToken} onSelect={setBuyToken} />
      <input
        type="number"
        placeholder="Amount to sell"
        value={sellAmount}
        onChange={(e) => setSellAmount(e.target.value)}
      />
      <button onClick={getQuote}>Get Quote</button>
      {quote && (
        <div>
          <p>Price: {quote.price}</p>
          <button onClick={handleSwap}>Swap</button>
        </div>
      )}
    </div>
  );
};

export default SwapForm;
