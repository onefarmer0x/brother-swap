import React, { useContext } from "react";
import { Button, HStack, Text, Box } from "@chakra-ui/react";
import { WalletContext } from "../context/WalletContext";

const WalletConnect = () => {
  const { account, connectWallet, disconnectWallet } = useContext(WalletContext);

  return (
    <Box>
      {account ? (
        <HStack>
          <Text fontSize="sm">Connected: {account.slice(0, 6)}...{account.slice(-4)}</Text>
          <Button size="sm" colorScheme="red" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </HStack>
      ) : (
        <Button size="sm" colorScheme="blue" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
};

export default WalletConnect;
