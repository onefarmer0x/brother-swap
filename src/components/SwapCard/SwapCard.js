import React, { useEffect, useState, useContext } from 'react';
import { Box, HStack, Image, Text, VStack, Button, Input, Divider, IconButton } from '@chakra-ui/react';
import { WalletContext } from '../../context/WalletContext';
import TokenSelectModal from './TokenSelectModal';
import './SwapCard.scss';

function SwapCard() {
  const { account, connectWallet } = useContext(WalletContext);
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState(3000); // Configurable polling interval (3 seconds default)

  useEffect(() => {
    async function loadTokens() {
      try {
        const response = await fetch(
          'https://starknet.api.avnu.fi/v1/starknet/tokens?page=0&size=50&tags=Verified'
        );
        const data = await response.json();
        const fetchedTokens = data.tokens || data.content || [];
        setTokens(fetchedTokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setTokens([]);
      }
    }

    loadTokens();
  }, []);

  useEffect(() => {
    const handleWalletDisconnect = () => {
      setFromToken(null);
      setToToken(null);
      setFromAmount('');
      setToAmount('');
    };

    window.addEventListener("walletDisconnected", handleWalletDisconnect);
    return () => window.removeEventListener("walletDisconnected", handleWalletDisconnect);
  }, []);

  /** Fetches the latest quote price */
  const fetchQuotePrice = async () => {
    if (!fromToken || !toToken || !fromAmount || parseFloat(fromAmount) <= 0) return;
    
    setLoading(true);
    try {
      const sellTokenAddress = fromToken.address;
      const buyTokenAddress = toToken.address;
      const sellAmount = (parseFloat(fromAmount) * 10 ** fromToken.decimals).toString(16);

      const response = await fetch(
        `https://starknet.api.avnu.fi/internal/swap/quotes-with-prices?sellTokenAddress=${sellTokenAddress}&buyTokenAddress=${buyTokenAddress}&sellAmount=0x${sellAmount}&size=3&integratorName=AVNU%20Portal`
      );
      const data = await response.json();

      if (data?.quotes?.length > 0) {
        const quote = data.quotes[0].buyAmount;
        const adjustedAmount = parseFloat(parseInt(quote, 16)) / 10 ** toToken.decimals;
        setToAmount(adjustedAmount.toFixed(6));
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  /** Polling function to fetch new quote every X seconds */
  useEffect(() => {
    if (!fromToken || !toToken || !fromAmount) return;

    const interval = setInterval(() => {
      fetchQuotePrice();
    }, pollingInterval);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [fromToken, toToken, fromAmount, pollingInterval]);

  return (
    <Box className="swap-container">
      <Box className="swap-card">
        {/* FROM INPUT */}
        <Box className="swap-section">
          <HStack className="swap-input">
            <div className='input-wrapper'>
                <Input
                    type="text"
                    placeholder="0.00"
                    value={fromAmount}
                    className='input-amount'
                    onChange={(e) => setFromAmount(e.target.value)}
                />
            </div>
            <div className="token-select-button">
                <TokenSelectModal tokens={tokens} onSelectToken={setFromToken} token={fromToken} />
            </div>
          </HStack>
        </Box>

        {/* SWAP ARROW */}
        <Divider className="divider" />

        {/* TO INPUT */}
        <Box className="swap-section">
          <HStack className="swap-input">
            <div className='input-wrapper'>
                <Input
                    type="text"
                    placeholder="0.00"
                    className='input-amount'
                    value={toAmount}
                    isReadOnly
                />
            </div>
            <div className="token-select-button">
              <TokenSelectModal tokens={tokens} onSelectToken={setToToken} token={toToken} />
            </div>
          </HStack>
        </Box>

        {/* REFRESH BUTTON */}
        <Box className="refresh-container" display="flex" justifyContent="center" mt={3}>
  <span 
    className="refresh-button" 
    onClick={fetchQuotePrice}
    style={{ cursor: "pointer", color: "#0070f3", fontSize: "18px", display: "flex", alignItems: "center", gap: "5px" }}
  >
    <i className="fa-solid fa-rotate-right"></i> {/* FontAwesome refresh icon */}
    Refresh Quote
  </span>
</Box>


        {/* SWAP BUTTON */}
        <div className='swap-button-wrapper'>
            {account ? (
                <Button 
                    className="swap-button" 
                    isDisabled={!fromAmount || !fromToken || !toToken || loading}
                >
                    {loading ? 'Fetching Price...' : 'Swap'}
                </Button>
            ) : (
                <Button 
                    className="swap-button" 
                    colorScheme="blue" 
                    onClick={connectWallet}
                >
                    Connect Wallet
                </Button>
            )}
        </div>
      </Box>
    </Box>
  );
}

export default SwapCard;
