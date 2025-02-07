// src/components/TokenSwap.js
import React, { useState } from 'react';
import { formatUnits, parseUnits } from 'ethers';
import { fetchQuotes, executeSwap } from '@avnu/avnu-sdk';

const TokenSwap = ({ account, tokens }) => {
  const [sellAmount, setSellAmount] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const ethAddress = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"; // Example ETH Address
  const strkAddress = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d"; // Example STRK Address

  const handleChangeInput = (event) => {
    if (!account) return;
    setErrorMessage('');
    setQuotes([]);
    setSellAmount(event.target.value);
    setLoading(true);
    const params = {
      sellTokenAddress: ethAddress,
      buyTokenAddress: strkAddress,
      sellAmount: parseUnits(event.target.value, 18),
      takerAddress: account.address,
      size: 1,
    };
    fetchQuotes(params, { baseUrl: 'https://sepolia.api.avnu.fi' })
      .then((quotes) => {
        setLoading(false);
        setQuotes(quotes);
      })
      .catch(() => setLoading(false));
  };

  const handleSwap = async () => {
    if (!account || !sellAmount || !quotes || !quotes[0]) return;
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    executeSwap(account, quotes[0], {}, { baseUrl: 'https://sepolia.api.avnu.fi' })
      .then(() => {
        setSuccessMessage('Swap successful!');
        setLoading(false);
        setQuotes([]);
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <div>
        <h2>Sell Token</h2>
        <h3>ETH</h3>
        <input onChange={handleChangeInput} disabled={loading} value={sellAmount} />
      </div>
      <div>&darr;</div>
      <div>
        <h2>Buy Token</h2>
        <h3>STRK</h3>
        <input
          readOnly
          type="text"
          value={quotes && quotes[0] ? formatUnits(quotes[0].buyAmount, 6) : ''}
        />
      </div>
      {loading ? <p>Loading...</p> : quotes && quotes[0] && <button onClick={handleSwap}>Swap</button>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>Success</p>}
    </div>
  );
};

export default TokenSwap;
