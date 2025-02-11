import React, { useEffect, useState, useContext } from 'react';
import { Box, HStack, Image, Text, VStack, Button, Input, Divider } from '@chakra-ui/react';
import TokenSelectModal from './TokenSelectModal';
import { WalletContext } from '../../context/WalletContext'; // Import Wallet Context
import './SwapCard.scss';

function SwapCard() {
  const { account } = useContext(WalletContext); // Get wallet state from context
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
                {fromToken && (
                    <Text fontSize="xs" color="gray.500" className='amount-input-sub'>
                        {formatAddress(fromToken.address)}
                    </Text>
                )}
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
                    onChange={(e) => setToAmount(e.target.value)}
                />
                {toToken && (
                    <Text fontSize="xs" color="gray.500" className='amount-input-sub'>
                        {formatAddress(toToken.address)}
                    </Text>
                )}
            </div>
            <div className="token-select-button">
              <TokenSelectModal tokens={tokens} onSelectToken={setToToken} token={toToken} />
            </div>
          </HStack>
        </Box>

        {/* SWAP BUTTON */}
        <div className='swap-button-wrapper'>
            <Button 
                className="swap-button" 
                isDisabled={!account || !fromAmount || !fromToken || !toToken || loading} // 🔥 Listens to `account`
            >
                {account ? (loading ? 'Fetching Price...' : 'Swap') : 'Connect Wallet'}
            </Button>
        </div>
      </Box>
    </Box>
  );
}

export default SwapCard;
