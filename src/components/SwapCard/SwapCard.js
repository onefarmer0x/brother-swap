import React, { useEffect, useState } from 'react';
import { Box, HStack, Image, Text, VStack, Button, Input, Divider } from '@chakra-ui/react';
import TokenSelectModal from './TokenSelectModal';
import './SwapCard.scss';

function SwapCard() {
  const [tokens, setTokens] = useState([]);
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /** Fetch the first 50 verified tokens from AVNU */
    async function loadTokens() {
      try {
        const response = await fetch(
          'https://starknet.api.avnu.fi/v1/starknet/tokens?page=0&size=50&tags=Verified'
        );
        const data = await response.json();
        const fetchedTokens = data.tokens || data.content || [];
        console.log('Fetched verified tokens:', fetchedTokens);
        setTokens(fetchedTokens);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setTokens([]);
      }
    }

    loadTokens();
  }, []);

  const formatAddress = (address) => {
    if (!address) return '';
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  /** Fetches the quote price from AVNU API */
  const fetchQuotePrice = async (amount, fromTo = 'from') => {
    if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      const sellTokenAddress = fromTo === 'from' ? fromToken.address : toToken.address;
      const buyTokenAddress = fromTo === 'from' ? toToken.address : fromToken.address;
      const sellAmount = (parseFloat(amount) * 10 ** fromToken.decimals).toString(16);

      const response = await fetch(
        `https://starknet.api.avnu.fi/internal/swap/quotes-with-prices?sellTokenAddress=${sellTokenAddress}&buyTokenAddress=${buyTokenAddress}&sellAmount=0x${sellAmount}&size=3&integratorName=AVNU%20Portal`
      );
      const data = await response.json();

      if (data?.quotes?.length > 0) {
        const quote = data.quotes[0].buyAmount;
        const adjustedAmount = parseFloat(parseInt(quote, 16)) / 10 ** toToken.decimals;

        if (fromTo === 'from') {
          setToAmount(adjustedAmount.toFixed(6));
        } else {
          setFromAmount(adjustedAmount.toFixed(6));
        }
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

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
                    onChange={(e) => {
                        setFromAmount(e.target.value);
                        fetchQuotePrice(e.target.value, 'from');
                    }}
                />
                {/* Token Info below amount input */}
                {fromToken && (
                    <Text fontSize="xs" color="gray.500" className='amount-input-sub'>
                        {formatAddress(fromToken.address)}
                    </Text>
                )}
            </div>

            {/* Token Selection with Selected Token Display */}

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
                    onChange={(e) => {
                        setToAmount(e.target.value);
                        fetchQuotePrice(e.target.value, 'to');
                    }}
                />

                {/* Token Info below amount input */}
                {toToken && (
                    <Text fontSize="xs" color="gray.500" className='amount-input-sub'>
                        {formatAddress(toToken.address)}
                    </Text>
                )}
            </div>
            
            

            {/* Token Selection with Selected Token Display */}
            <div className="token-select-button">
              <TokenSelectModal tokens={tokens} onSelectToken={setToToken} token={toToken} />
            </div>

          </HStack>
        </Box>

        {/* SWAP BUTTON */}
        <div className='swap-button-wrapper'>
            <div className="swap-button" isDisabled={!fromAmount || !fromToken || !toToken || loading}>
            {loading ? 'Fetching Price...' : 'Swap'}
            </div>
        </div>
      </Box>
    </Box>
  );
}

export default SwapCard;
