// src/hooks/useTokens.js
import { useEffect, useState } from 'react';
import { fetchTokens } from '@avnu/avnu-sdk';

const AVNU_OPTIONS = { baseUrl: 'https://sepolia.api.avnu.fi' };

const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [tokenSize, setTokenSize] = useState(0);

  useEffect(() => {
    fetchTokens({ page: 0, size: 50, tags: ['Verified'] }, AVNU_OPTIONS)
      .then((page) => {
        setTokens(page.content);
        setTokenSize(page.totalElements);
      })
      .catch((error) => {
        console.error('Error fetching tokens:', error);
      });
  }, []);

  return { tokens, tokenSize };
};

export default useTokens;
